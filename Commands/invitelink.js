const Discord = require('discord.js');

module.exports = {
    name: 'invitelink',
    description: 'Sends the invite link for the bot.',
    usage: 'invitelink',
    guildOnly: true,
    execute(message) {
        message.channel.send('https://discordapp.com/oauth2/authorize?client_id=723094801175806024&scope=bot&permissions=268561494');
    }
}