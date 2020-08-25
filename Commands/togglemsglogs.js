const Discord = require('discord.js');
const Keyv = require('keyv');
const database = require('../database.json');
const logchannels = new Keyv(database.logchannels);
const msglogs = new Keyv(database.msglogs);

module.exports = {
    name: 'togglemsglogs',
    description: `Toggles message logs on/off.`,
    usage: 'togglemsglogs',
    guildOnly: true,
    async execute(message, prefix) {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log) {
            message.channel.send(`You need to set a channel for logs to be sent in. Use ${prefix}setlogschannel to setup one.`);
            return message.react('❌');
        }
        let logs = await msglogs.get(`msglogs_${message.guild.id}`);
        let state;
        if (!logs || logs == 0) {
            logs = 1;
            state = 'on';
        }
        else {
            logs = 0;
            state = 'off';
        }
        await msglogs.set(`msglogs_${message.guild.id}`, logs);
        message.react('✔️');
        message.channel.send(`Message logs are now set to ${state}.`);
    }
}