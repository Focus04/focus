const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const leavechannels = new Keyv(database.leavechannels);
const leavemessages = new Keyv(database.leavemessages);
module.exports = {
    name: 'leavemessage',
    description: `Sets a custom good bye message for those leaving the server.`,
    usage: 'leavemessage `message`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let msg = [];
        for (let i = 0; i < args.length; i++)
            msg = msg + args[i] + ' ';
        if(!args[0])
            message.channel.send(`Proper command usage: ${prefix}leavemessage [message]`);
        else
            if (!message.member.hasPermission('MANAGE_GUILD'))
                message.channel.send('You require the Manage Server permission in order to run this command.');
            else {
                let leavechname = await leavechannels.get(`leavechannel_${message.guild.id}`);
                let leavechannel = await message.guild.channels.cache.find(ch => ch.name === `${leavechname}`);
                if (!leavechannel)
                    message.channel.send(`You need to set a channel for leave messages to be sent in. Use ${prefix}setleavechannel to setup one.`);
                else {
                    await leavemessages.set(`leavemessage_${message.guild.id}`, msg);
                    message.channel.send(`Leave message set to ${msg}.`);
                }
            }
    }
}