const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);
const logchannels = new Keyv(process.env.logchannels);
const msglogs = new Keyv(process.env.msglogs);
const welcomechannels = new Keyv(process.env.welcomechannels);
const welcomeroles = new Keyv(process.env.welcomeroles);
const welcomemessages = new Keyv(process.env.welcomemessages);
const togglewelcome = new Keyv(process.env.togglewelcome);
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.togglewelcomedm);
const leavechannels = new Keyv(process.env.leavechannels);
const leavemessages = new Keyv(process.env.leavemessages);
const toggleleave = new Keyv(process.env.toggleleave);
const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
fs.readdirSync('./Commands').forEach(folder => {
    fs.readdirSync(`./Commands/${folder}`).forEach(file => {
        const command = require(`./Commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    });
});

fs.readdirSync('./Events').forEach(folder => {
    fs.readdirSync(`./Events/${folder}`).forEach(file =>{
        const event = require(`./Events/${folder}/${file}`);
        client.on(file.split('.')[0], event.bind(null, client));
    });
});

client.login(process.env.token);