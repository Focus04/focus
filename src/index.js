const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.dblToken, client);

client.commands = new Discord.Collection();
fs.readdirSync('./src/commands').forEach(folder => {
  fs.readdirSync(`./src/commands/${folder}`).forEach(file => {
    const command = require(`./src/commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  });
});

fs.readdirSync('./src/events').forEach(folder => {
  fs.readdirSync(`./src/events/${folder}`).forEach(file => {
    const event = require(`./src/events/${folder}/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.login(process.env.token);