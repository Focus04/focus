const Discord = require('discord.js');
const Keyv = require('keyv');
const database = require('../database.json');
const prefixes = new Keyv(database.prefixes);
const leavechannels = new Keyv(database.leavechannels);
const toggleleave = new Keyv(database.toggleleavemsg);
module.exports = {
    name: 'toggleleavemsg',
    description: `Toggles leave messages on/off.`,
    usage: 'toggleleavemsg',
    guildOnly: true,
    async execute(message) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let leavechname = await leavechannels.get(`leavechannel_${message.guild.id}`);
        let leave = message.guild.channels.cache.find(ch => ch.name === `${leavechname}`);
        if (!leave) {
            message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
            return message.react('❌');
        }
        let logs = await toggleleave.get(`toggleleavemsg_${message.guild.id}`);
        let state;
        if (!logs || logs == 0) {
            logs = 1;
            state = 'on';
        }
        else {
            logs = 0;
            state = 'off';
        }
        await toggleleave.set(`toggleleavemsg_${message.guild.id}`, logs);
        message.react('✔️');
        message.channel.send(`Leave messages are now set to ${state}.`);
    }
}