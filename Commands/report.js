const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'report',
    description: `Submits a report to the staff's logs channel.`,
    usage: 'report `username` `offense`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.guild.members.cache.find(user => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`);
        if (!member) {
            message.channel.send(`Couldn't find ${args[0]}`);
            return message.react('❌');
        }
        if (!args[1]) {
            message.channel.send(`Proper command usage: ${prefix}report [username] [offense]`);
            return message.react('❌');
        }
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log) {
            message.channel.send(`Looks like the server doesn't have any logs channel. Please ask a staff member to setup one using ${prefix}setlogschannel`);
            return message.react('❌');
        }
        args.shift();
        let report = args.join(' ');
        let reportembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} New Report`)
            .addFields(
                { name: 'Submitted by:', value: `${message.author.username}` },
                { name: 'Defendant:', value: `${member}` },
                { name: 'Offense', value: `${report}` }
            )
            .setTimestamp();
        message.react('✔️');
        await log.send(reportembed);
        await message.author.send(`${member} has been successfully reported to the server's staff.`);
        message.channel.bulkDelete(1);
    }
}