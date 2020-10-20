const EventEmitter = require('events');
const https = require('https');
const qs = require('querystring');

const isLib = (library, client) => {
  try {
    const lib = require.cache[require.resolve(library)];
    return lib && client instanceof lib.exports.Client;
  } catch (e) {
    return false;
  }
};

const isASupportedLibrary = client => isLib('discord.js', client) || isLib('eris', client);

class DBLAPI extends EventEmitter {
  /**
   * Creates a new DBLAPI Instance.
   * @param {string} token Your top.gg token for this bot.
   * @param {Object} [options] Your DBLAPI options.
   * @param {number} [options.statsInterval=1800000] How often the autoposter should post stats in ms. May not be smaller than 900000 and defaults to 1800000.
   * @param {number} [options.webhookPort] The port to run the webhook on. Will activate webhook when set.
   * @param {string} [options.webhookAuth] The string for Authorization you set on the site for verification.
   * @param {string} [options.webhookPath='/dblwebhook'] The path for the webhook request.
   * @param {http.Server} [options.webhookServer] An existing http server to attach the webhook to.
   * @param {any} [client] Your Client instance, if present and supported it will auto update your stats every `options.statsInterval` ms.
   */
  constructor(token, options, client) {
    super();
    this.token = token;
    if (isASupportedLibrary(options)) {
      client = options;
      options = {};
    }
    this.options = options || {};

    if (client && isASupportedLibrary(client)) {
      if (!this.options.statsInterval) this.options.statsInterval = 1800000;
      if (this.options.statsInterval < 900000) throw new Error('statsInterval may not be shorter than 900000 (15 minutes)');

      /**
       * Event that fires when the stats have been posted successfully by the autoposter
       * @event posted
       */

      /**
       * Event to notify that the autoposter post request failed
       * @event error
       * @param {error} error The error
       */

      this.client = client;
      this.client.on('ready', () => {
        this.postStats()
          .then(() => this.emit('posted'))
          .catch(e => this.emit('error', e));
        setInterval(() => {
          this.postStats()
            .then(() => this.emit('posted'))
            .catch(e => this.emit('error', e));
        }, this.options.statsInterval);
      });
    } else if (client) {
      console.error(`[dblapi.js autopost] The provided client is not supported. Please add an issue or pull request to the github repo https://github.com/top-gg/dblapi.js`); // eslint-disable-line no-console
    }

    if (this.options.webhookPort || this.options.webhookServer) {
      const DBLWebhook = require('./webhook');
      this.webhook = new DBLWebhook(this.options.webhookPort, this.options.webhookPath, this.options.webhookAuth, this.options.webhookServer);
    }
  }

  /**
   * Creates the request.
   * @param {string} method Http method to use.
   * @param {string} endpoint API endpoint to use.
   * @param {Object} [data] Data to send with the request.
   * @private
   * @returns {Promise<Object>}
   */
  _request(method, endpoint, data) {
    return new Promise((resolve, reject) => {
      const response = {
        raw: '',
        body: null,
        status: null,
        headers: null,
      };

      const options = {
        hostname: 'top.gg',
        path: `/api/${endpoint}`,
        method,
        headers: {},
      };

      if (this.token) {
        options.headers.authorization = this.token;
      } else {
        console.warn('[dblapi.js] Warning: No DBL token has been provided.'); // eslint-disable-line no-console
      }
      if (data && method === 'post') options.headers['content-type'] = 'application/json';
      if (data && method === 'get') options.path += `?${qs.encode(data)}`;

      const request = https.request(options, res => {
        response.status = res.statusCode;
        response.headers = res.headers;
        response.ok = res.statusCode >= 200 && res.statusCode < 300;
        response.statusText = res.statusMessage;
        res.on('data', chunk => {
          response.raw += chunk;
        });
        res.on('end', () => {
          response.body = res.headers['content-type'].includes('application/json') ? JSON.parse(response.raw) : response.raw;
          if (response.ok) {
            resolve(response);
          } else {
            const err = new Error(`${res.statusCode} ${res.statusMessage}`);
            Object.assign(err, response);
            reject(err);
          }
        });
      });

      request.on('error', err => {
        reject(err);
      });

      if (data && method === 'post') request.write(JSON.stringify(data));
      request.end();
    });
  }

  /**
   * Post Stats to Discord Bot List.
   * @param {number|number[]} serverCount The server count of your bot.
   * @param {number} [shardId] The ID of this shard.
   * @param {number} [shardCount] The count of all shards of your bot.
   * @returns {Promise<Object>}
   */
  async postStats(serverCount, shardId, shardCount) {
    if (!serverCount && !this.client) throw new Error('postStats requires 1 argument');
    const data = {};
    if (serverCount) {
      data.server_count = serverCount;
      data.shard_id = shardId;
      data.shard_count = shardCount;
    } else {
      data.server_count = this.client.guilds.size || this.client.guilds.cache.size;
      if (this.client.shard && this.client.shard.count) {
        if (this.client.shard.ids && this.client.shard.ids.length === 1 && this.client.shard.count > 1) {
          data.shard_id = this.client.shard.ids[0];
        } else {
          data.shard_id = this.client.shard.id;
        }
        data.shard_count = this.client.shard.count;
      } else if (this.client.shards && this.client.shards.size !== 1) {
        data.shard_count = this.client.shards.size;
      }
    }
    const response = await this._request('post', 'bots/stats', data, true);
    return response.body;
  }

  /**
   * Gets stats from a bot.
   * @param {string} id The ID of the bot you want to get the stats from.
   * @returns {Promise<Object>}
   */
  async getStats(id) {
    if (!id && !this.client) throw new Error('getStats requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}/stats`);
    return response.body;
  }

  /**
   * Gets information about a bot.
   * @param {string} id The ID of the bot you want to get the information from.
   * @returns {Promise<Object>}
   */
  async getBot(id) {
    if (!id && !this.client) throw new Error('getBot requires id as argument');
    if (!id) id = this.client.user.id;
    const response = await this._request('get', `bots/${id}`);
    return response.body;
  }

  /**
   * Gets information about a user.
   * @param {string} id The ID of the user you want to get the information from.
   * @returns {Promise<Object>}
   */
  async getUser(id) {
    if (!id) throw new Error('getUser requires id as argument');
    const response = await this._request('get', `users/${id}`);
    return response.body;
  }

  /**
   * Gets a list of bots matching your query.
   * @param {Object} query The query for the search.
   * @returns {Promise<Object>}
   */
  async getBots(query) {
    const response = await this._request('get', 'bots', query);
    return response.body;
  }

  /**
   * Gets votes from your bot.
   * @returns {Promise<Array>}
   */
  async getVotes() {
    const response = await this._request('get', 'bots/votes', undefined, true);
    return response.body;
  }

  /**
   * Returns true if a user has voted for your bot in the last 24h.
   * @param {string} id The ID of the user to check for.
   * @returns {Promise<boolean>}
   */
  async hasVoted(id) {
    if (!id) throw new Error('hasVoted requires id as argument');
    const response = await this._request('get', 'bots/check', { userId: id }, true);
    return !!response.body.voted;
  }

  /**
   * Returns true if the weekend multiplier is currently active.
   * @returns {Promise<boolean>}
   */
  async isWeekend() {
    const response = await this._request('get', 'weekend');
    return response.body.is_weekend;
  }
}

module.exports = DBLAPI;
