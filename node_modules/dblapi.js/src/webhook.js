const EventEmitter = require('events');
const { Server, createServer } = require('http');
const querystring = require('querystring');

class DBLWebhook extends EventEmitter {
  /**
   * Creates a new DBLWebhook Instance.
   * @param {number} port The port to run the webhook on.
   * @param {string} [path='/dblwebhook'] The path for the webhook request.
   * @param {string} [auth] The string for Authorization you set on the site for verification.
   * @param {http.Server} [server] An existing http server to connect with.
   */
  constructor(port, path, auth, server) {
    if (!port && !server) throw new Error('Neither port nor server provided');
    super();
    this.port = port || 0;
    this.path = path || '/dblwebhook';
    this.auth = auth;

    this._server = null;
    this.attached = false;

    if (server && !(server instanceof Server)) throw Error('The server is not an instance of http.Server');
    if (server) {
      this._attachWebhook(server);
    } else {
      this._startWebhook();
    }
  }

  _emitListening() {
    /**
     * Event to notify that the webhook is listening
     * @event DBLWebhook#ready
     * @param {string} hostname The hostname of the webhook server
     * @param {number} port The port the webhook server is running on
     * @param {string} path The path for the webhook
     */
    // Get the user's public IP via an API for hostname later?
    this.emit('ready', { hostname: '0.0.0.0', port: this.port, path: this.path });
  }

  _startWebhook() {
    this._server = createServer(this._handleRequest.bind(this));
    this._server.listen(this.port, this._emitListening.bind(this));
  }

  _attachWebhook(server) {
    this._server = server;
    this._listeners = server.listeners('request');
    server.removeAllListeners('request');
    server.on('request', this._handleRequest.bind(this));
    server.on('listening', this._emitListening.bind(this));
    this.attached = true;
  }

  _handleRequest(req, res) {
    if (req.url === this.path && req.method === 'POST') {
      if (this.auth && this.auth !== req.headers.authorization) return this._returnResponse(res, 403);
      if (req.headers['content-type'] !== 'application/json') return this._returnResponse(res, 400);
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        if (data) {
          try {
            data = JSON.parse(data);
            if (data.query === '') data.query = undefined;
            if (data.query) data.query = querystring.parse(data.query.substr(1));
          } catch (e) {
            return this._returnResponse(res, 400);
          }
          /**
           * Event that fires when the webhook has received a vote.
           * @event DBLWehook#vote
           * @param {string} bot Id of the bot that was voted for.
           * @param {string} user Id of the user that voted.
           * @param {string} type Type of the vote. Is always "upvote" except when using the test button it's "test".
           * @param {boolean} isWeekend Whether the weekend multiplier is in effect, meaning users votes count as two.
           * @param {object} [query] The possible querystring parameters from the vote page.
           */
          this.emit('vote', data);
          return this._returnResponse(res, 200, 'Webhook successfully received');
        } else {
          return this._returnResponse(res, 400);
        }
      });
    } else {
      if (this.attached) {
        for (const listener of this._listeners) {
          listener.call(this._server, req, res);
        }
        return undefined;
      }
      return this._returnResponse(res, 404);
    }
    return undefined;
  }

  _returnResponse(res, statusCode, data) {
    res.statusCode = statusCode;
    res.end(data);
  }
}

module.exports = DBLWebhook;
