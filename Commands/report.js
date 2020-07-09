const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'report',
    description: `Submits a report to the staff's logs channel.`,
    usage: 'bugreport @`user` `offense`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.users.first();
        let report = [];
        for (let i = 1; i < args.length; i++)
            report = report + args[i] + ' ';
        if (!member || !args[1])
            message.channel.send(`Proper command usage: ${prefix}report @[user] [offense]`);
        else {
            let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
            let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
            if (!log)
                message.channel.send(`Looks like the server doesn't have any logs channel. Please ask a staff member to setup one using ${prefix}setlogschannel`);
            else {
                let reportembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle('Report')
                    .addFields(
                        { name: 'Submitted by:', value: `${message.author.username}` },
                        { name: 'Defendant:', value: `${member}` },
                        { name: 'Offense', value: `${report}` }
                    )
                    .setTimestamp();
                await log.send(reportembed);
                await message.author.send(`${member} has been successfully reported to the server's staff.`);
                message.channel.bulkDelete(1);
            }
        }
    }
}