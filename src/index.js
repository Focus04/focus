const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
const DBL = require('dblapi.js');
const dbl = new DBL(process.env.dblToken, client);

client.commands = new Discord.Collection();
fs.readdirSync('./commands').forEach(folder => {
  fs.readdirSync(`./commands/${folder}`).forEach(file => {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  });
});

fs.readdirSync('./events').forEach(folder => {
  fs.readdirSync(`./events/${folder}`).forEach(file => {
    const event = require(`./events/${folder}/${file}`);
    client.on(file.split('.')[0], event.bind(null, client));
  });
});

client.login(process.env.token);