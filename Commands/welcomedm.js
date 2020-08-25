const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const welcomedms = new Keyv(database.welcomedms);
const togglewelcomedm = new Keyv(database.togglewelcomedm);
const logchannels = new Keyv(database.logchannels);

module.exports = {
    name: 'welcomedm',
    description: `Sets a custom welcome message that will be inboxed to new users.`,
    usage: 'welcomedm `message`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}welcomedm [message]. Use [user] to be replaced with a username.`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let msg = args.join(' ');
        await welcomedms.set(`welcomedm_${message.guild.id}`, msg);
        await togglewelcomedm.set(`togglewelcomedm_${message.guild.id}`, 1);
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
        else
            log.send(`Welcome DM successfully changed to ${'`' + msg + '`'}`);
    }
}