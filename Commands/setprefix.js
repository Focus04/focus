const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
module.exports = {
    name: 'setprefix',
    description: 'Changes the default `/` prefix to a custom one.',
    usage: 'setprefix `prefix`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}setprefix [prefix]`);
            message.react('❌');
        }
        else
            if (!message.member.hasPermission('MANAGE_GUILD')) {
                message.channel.send('You need the Manage Server permission in order to run this command.');
                message.react('❌');
            }
            else {
                await prefixes.set(message.guild.id, args[0]);
                message.channel.send(`Server prefix successfully changed to ${args[0]}.`);
            }
    }
}