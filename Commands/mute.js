const Discord = require('discord.js');
const ms = require('ms');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const mts = new Keyv(database.mts);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'mute',
    description: `Restricts a user from sending messages.`,
    usage: 'mute @`user` `minutes` `reason`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.members.first();
        let user = message.mentions.users.first();
        let author = message.author.username;
        let reason = [];
        let mins = args[1];
        let mutedrole = message.guild.roles.cache.find(r => r.name === 'Muted Member');
        if (!message.guild.me.hasPermission('MANAGE_ROLES') || !message.guild.member(member).kickable)
            return message.channel.send('I require the `Manage Roles` permission in order to perform this action.  In case I have it, make sure that my role is higher than the role of the person you want to mute!');
        for (let i = 2; i < args.length; i++)
            reason = reason + args[i] + ' ';
        if (!member || isNaN(mins) || !args[2])
            message.channel.send(`Proper command usage: ${prefix}mute @[user] [minutes] [reason]`);
        else
            if (!message.member.hasPermission('KICK_MEMBERS'))
                message.channel.send(`You need the Kick Members permission in order to run this command.`);
            else {
                if (member.id == message.author.id)
                    return message.channel.send(`You can't mute youself, smarty pants!`);
                mins = mins + ' minutes';
                let mutes = await mts.get(`mutes_${member.id}_${message.guild.id}`);
                if (!mutes)
                    mutes = 1;
                else
                    mutes = mutes + 1;
                member.send(`${author} has muted you from ${message.guild.name} for ${reason}. Duration: ${mins}.`);
                if (!mutedrole) {
                    await message.guild.roles.create({
                        data: {
                            name: 'Muted Member',
                            permissions: []
                        }
                    });
                    mutedrole = await message.guild.roles.cache.find(r => r.name === 'Muted Member');
                    message.guild.channels.cache.forEach(async (channel, id) => {
                        await channel.updateOverwrite(mutedrole, {
                            'SEND_MESSAGES': false,
                            'EMBED_LINKS': false,
                            'ATTACH_FILES': false,
                            'ADD_REACTIONS': false,
                            'SPEAK': false
                        });
                    });
                }
                if (member.roles.cache.has(mutedrole.id))
                    message.channel.send(`${user.username} is already muted!`);
                else {
                    const muteembed = new Discord.MessageEmbed()
                        .setColor('#00ffbb')
                        .setTitle('Mute Information')
                        .addFields(
                            { name: `Defendant's name:`, value: `${member}` },
                            { name: `Issued by:`, value: `${author}` },
                            { name: `Reason:`, value: `${reason}` },
                            { name: `Duration:`, value: `${mins}` },
                        )
                        .setFooter(`You can use ${prefix}unmute to unmute the user earlier than ${mins}.`)
                        .setTimestamp();
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if (!log)
                        await message.channel.send(muteembed);
                    else
                        await log.send(muteembed);
                    await mts.set(`mutes_${member.id}_${message.guild.id}`, mutes);
                    member.roles.add(mutedrole);
                    setTimeout(function () {
                        if (member.roles.cache.has(mutedrole.id)) {
                            member.roles.remove(mutedrole);
                            if (!log)
                                message.channel.send(`${member} has been unmuted.`);
                            else
                                log.send(`${member} has been unmuted.`);
                            member.send(`You have been unmuted from ${message.guild.name}.`);
                        }
                    }, ms(mins));
                }
            }
    }
}