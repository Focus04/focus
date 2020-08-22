const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
const bannedusers = new Keyv(database.bannedusers);

module.exports = {
    name: 'unban',
    description: `Removes a user's banned status earlier.`,
    usage: 'unban `username`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            message.channel.send('I require the Ban Members permission in order to perform this action!');
            return message.react('❌');
        }
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}unban username`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            message.channel.send(`It appears that you lack permissions to unban.`);
            return message.react('❌');
        }
        let userid = await bannedusers.get(`${message.guild.id}_${args[0]}`);
        if (!userid) {
            message.channel.send(`${args[0]} isn't banned.`);
            return message.react('❌');
        }
        await message.guild.members.unban(userid).catch(err => {
            console.error(err);
            message.channel.send(`${args[0]} isn't banned.`);
            return message.react('❌');
        })
        await bannedusers.delete(`${message.guild.id}_${args[0]}`);
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(`${args[0]} has been unbanned earlier.`);
        else
            log.send(`${args[0]} has been unbanned earlier.`);
    }
}