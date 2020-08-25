const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const logchannels = new Keyv(database.logchannels);

module.exports = {
    name: 'setlogschannel',
    description: `Sets a custom channel where moderation logs will be sent.`,
    usage: 'setlogschannel `channel-name`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}setlogschannel [channel-name]`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let channel = message.guild.channels.cache.find(ch => ch.name === `${args[0]}`);
        if (!channel) {
            message.channel.send(`Couldn't find ${args[0]}. Please make sure that I have access to that channel.`);
            return message.react('❌');
        }
        await logchannels.set(`logchannel_${message.guild.id}`, args[0]);
        message.react('✔️');
        message.channel.send(`All moderation actions will be logged in ${args[0]} from now on.`);
    }
}