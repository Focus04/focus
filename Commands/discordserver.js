const Discord = require('discord.js');

module.exports = {
    name: 'discordserver',
    description: `Sends an invite link to the bot's support server.`,
    usage: 'discordserver',
    guildOnly: true,
    execute(message) {
        message.channel.send('https://discord.gg/r4bsXez');
    }
}