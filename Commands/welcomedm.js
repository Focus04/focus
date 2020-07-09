const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const welcomedms = new Keyv(database.welcomedms);
module.exports = {
    name: 'welcomedm',
    description: `Sets a custom welcome message that will be inboxed to new users.`,
    usage: 'welcomedm `message`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let msg = [];
        for (let i = 0; i < args.length; i++)
            msg = msg + args[i] + ' ';
        if(!args[0])
            message.channel.send(`Proper command usage: ${prefix}welcomedm [message]`);
        else
            if (!message.member.hasPermission('MANAGE_GUILD'))
                message.channel.send('You require the Manage Server permission in order to run this command.');
            else {
                await welcomedms.set(`welcomedm_${message.guild.id}`, msg);
                message.channel.send(`Welcome DM set to ${msg}.`);
            }
    }
}