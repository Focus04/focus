const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const leavedms = new Keyv(database.leavedms);
module.exports = {
    name: 'leavedm',
    description: `Sets a custom message that will be inboxed to leaving users.`,
    usage: 'leavedm `message`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let msg = [];
        for (let i = 0; i < args.length; i++)
            msg = msg + args[i] + ' ';
        if(!args[0])
            message.channel.send(`Proper command usage: ${prefix}leavedm [message]`);
        else
            if (!message.member.hasPermission('MANAGE_GUILD'))
                message.channel.send('You require the Manage Server permission in order to run this command.');
            else {
                await leavedms.set(`leavedm_${message.guild.id}`, msg);
                message.channel.send(`Leave DM set to ${msg}.`);
            }
    }
}