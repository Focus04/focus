const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'unban',
    description: `Removes a user's banned status earlier.`,
    usage: 'unban `ID`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!message.guild.me.hasPermission('BAN_MEMBERS'))
            return message.channel.send('I require the Ban Members permission in order to perform this action!');
        if (!args[0])
            message.channel.send(`Proper command usage: ${prefix}unban [ID]`);
        else
            if (!message.member.hasPermission('BAN_MEMBERS'))
                message.channel.send(`It appears that you lack permissions to unban.`);
            else {
                let e = 0;
                await message.guild.members.unban(args[0]).catch(err => {
                    console.error(err);
                    message.channel.send(`${args[0]} isn't banned.`);
                    e = 1;
                })
                if (e == 0) {
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if (!log)
                        message.channel.send(`${args[0]} has been unbanned earlier.`);
                    else
                        log.send(`${args[0]} has been unbanned earlier.`);
                }
            }
    }
}