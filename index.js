const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({partials: ['MESSAGE']});

client.commands = new Discord.Collection();
fs.readdirSync('./Commands').forEach(folder => {
    fs.readdirSync(`./Commands/${folder}`).forEach(file => {
        const command = require(`./Commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    });
});

fs.readdirSync('./Events').forEach(folder => {
    fs.readdirSync(`./Events/${folder}`).forEach(file => {
        const event = require(`./Events/${folder}/${file}`);
        client.on(file.split('.')[0], event.bind(null, client));
    });
});

client.login(process.env.token);