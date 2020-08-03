const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const bns = new Keyv(database.bns);
const logchannels = new Keyv(database.logchannels);
const bannedusers = new Keyv(database.bannedusers);
module.exports = {
    name: 'ban',
    description: `Restricts a user's access to the server.`,
    usage: 'ban @`user` `(days)` `reason`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.members.first();
        let user = message.mentions.users.first();
        let author = message.author.username;
        let reason = [];
        let days = args[1];
        if (!message.guild.me.hasPermission('BAN_MEMBERS'))
            return message.channel.send('I require the `Ban Members` permission in order to perform this action.');
        if (isNaN(days)) {
            for (let i = 1; i < args.length; i++)
                reason = reason + args[i] + ' ';
            if (!member || !args[1])
                message.channel.send(`Proper command usage: ${prefix}ban @[user] (days) [reason]`);
            else
                if (!message.member.hasPermission('BAN_MEMBERS') || !message.guild.member(member).bannable)
                    message.channel.send(`It appears that you lack permissions to ban. In case you have them, make sure that my role is higher than the role of the person you want to ban!`);
                else {
                    if (member.id == message.author.id)
                        return message.channel.send(`You can't ban youself, smarty pants!`);
                    await bannedusers.set(`${message.guild.id}_${member.user.username}`, member.user.id);
                    let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
                    if (!bans)
                        bans = 1;
                    else
                        bans = bans + 1;
                    const banembed1 = new Discord.MessageEmbed()
                        .setColor('#00ffbb')
                        .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Ban Information`)
                        .addFields(
                            { name: `Defendant's name:`, value: `${member}` },
                            { name: `Issued by:`, value: `${author}` },
                            { name: `Reason:`, value: `${reason}` },
                            { name: `Duration:`, value: `Permanent` },
                        )
                        .setFooter(`You can use ${prefix}unban ${member.user.username} to unban ${member.user.username} earlier.`)
                        .setTimestamp();
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if (!log)
                        await message.channel.send(banembed1);
                    else
                        await log.send(banembed1);
                    await member.send(`${author} has permanently banned you from ${message.guild.name} for ${reason}.`);
                    await bns.set(`bans_${member.id}_${message.guild.id}`, bans);
                    message.guild.member(member).ban();
                }
        }
        else {
            for (let i = 2; i < args.length; i++)
                reason = reason + args[i] + ' ';
            if (!member || !args[2])
                message.channel.send(`Proper command usage: ${prefix}ban @[user] (days) [reason]`);
            else
                if (!message.member.hasPermission('BAN_MEMBERS') || !message.guild.member(member).bannable)
                    message.channel.send(`It appears that you lack permissions to ban. In case you have them, make sure that my role is higher than the role of the person you want to ban!`);
                else {
                    if (member.id == message.author.id)
                        return message.channel.send(`You can't ban youself, smarty pants!`);
                    await bannedusers.set(`${message.guild.id}_${member.user.username}`, member.user.id);
                    let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
                    if (!bans)
                        bans = 1;
                    else
                        bans = bans + 1;
                    const banembed2 = new Discord.MessageEmbed()
                        .setColor('#00ffbb')
                        .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Ban Information`)
                        .addFields(
                            { name: `Defendant's name:`, value: `${member}` },
                            { name: `Issued by:`, value: `${author}` },
                            { name: `Reason:`, value: `${reason}` },
                            { name: `Duration:`, value: `${days} days` },
                        )
                        .setFooter(`You can use ${prefix}unban ${member.user.username} to unban ${member.user.username} earlier than ${days} days.`)
                        .setTimestamp();
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if (!log)
                        await message.channel.send(banembed2);
                    else
                        await log.send(banembed2);
                    await member.send(`${author} has banned you from ${message.guild.name} for ${reason}. Duration: ${days} days.`);
                    await bns.set(`bans_${member.id}_${message.guild.id}`, bans);
                    message.guild.member(member).ban();
                    setTimeout(async function () {
                        let baninfo = message.guild.fetchBan(user);
                        if (baninfo) {
                            await bannedusers.delete(`${message.guild.id}_${member.user.username}`);
                            message.guild.members.unban(member.id);
                            if (!log)
                                message.channel.send(`${member} has been unbanned.`);
                            else
                                log.send(`${member} has been unbanned.`);
                            user.send(`You have been unbanned from ${message.guild.name}.`);
                        }
                    }, days * 86400000)
                }
        }
    }
}