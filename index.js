const { readdirSync } = require('fs');
const { Client, Collection } = require('discord.js');
const DBL = require('dblapi.js');
const options = {
  partials: ['MESSAGE', 'REACTION'],
  ws: {
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS']
  }
};
const client = new Client(options);
const dbl = new DBL(process.env.dblToken, client);

client.commands = new Collection();
readdirSync('./Commands').forEach(folder => {
  readdirSync(`./Commands/${folder}`).forEach(file => {
    const command = require(`./Commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  });
});

readdirSync('./Events').forEach(folder => {
  readdirSync(`./Events/${folder}`).forEach(file => {
    const event = require(`./Events/${folder}/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.login(process.env.token);