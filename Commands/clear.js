const Discord = require("discord.js");
const database = require('../database.json');
const Keyv = require('keyv');
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'clear',
    description: 'Bulk deletes a certain amount of messages.',
    usage: 'clear `amount`',
    guildOnly: true,
    async execute(message, args) {
        if (!message.guild.me.hasPermission('MANAGE_MESSAGES')) {
            message.channel.send('I require the `Manage Messages` permission in order to perform this action!');
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            message.channel.send(`It appears that you don't have permission to clear messages.`);
            return message.channel.react('❌');
        }
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount) || amount < 2 || amount > 100) {
            message.channel.send(`You must enter a number higher than 0 and less than 100.`);
            return message.react('❌');
        }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send(`Can't delete messages older than 2 weeks.`);
            return message.react('❌');
        });
        let clearembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Cleared Messages`)
            .addFields(
                { name: 'Cleared by:', value: `${message.author.username}` },
                { name: 'Amount of Messages Deleted:', value: `${amount}` },
                { name: 'Channel:', value: `${message.channel.name}` }
            )
            .setTimestamp();
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(clearembed);
        else
            log.send(clearembed);
    }
}