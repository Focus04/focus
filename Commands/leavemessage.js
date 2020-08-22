const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const leavechannels = new Keyv(database.leavechannels);
const leavemessages = new Keyv(database.leavemessages);
const logchannels = new Keyv(database.logchannels);
const toggleleavemsg = new Keyv(database.toggleleavemsg);

module.exports = {
    name: 'leavemessage',
    description: `Sets a custom good bye message for those leaving the server.`,
    usage: 'leavemessage `message`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}leavemessage [message]. Use [user] to be replaced with a username.`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let msg = args.join(' ');
        let leavechname = await leavechannels.get(`leavechannel_${message.guild.id}`);
        let leavechannel = await message.guild.channels.cache.find(ch => ch.name === `${leavechname}`);
        if (!leavechannel) {
            message.channel.send(`You need to set a channel for leave messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
            return message.react('❌');
        }
        await leavemessages.set(`leavemessage_${message.guild.id}`, msg);
        await toggleleavemsg.set(`toggleleavemsg_${message.guild.id}`, 1);
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = await message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(`Leave message successfully changed to ${'`' + msg + '`'}`);
        else
            log.send(`Leave message successfully changed to ${'`' + msg + '`'}`);
    }
}