const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const nts = new Keyv(database.notes);
module.exports = {
    name: 'viewnotes',
    description: `Views all notes linked to an account.`,
    usage: 'viewnotes `username`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.guild.members.cache.find(user => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`);
        if (!member)
            return message.channel.send(`Couldn't find ${args[0]}.`);
        if (!member)
            message.channel.send(`Proper command usage: ${prefix}viewnotes [username]`);
        else
            if (!message.member.hasPermission('KICK_MEMBERS'))
                message.channel.send('You need the Kick Members permission in order to run this command.');
            else {
                let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
                message.channel.send('Check your inbox.');
                if (!notes)
                    message.author.send(`There are no notes linked to ${member.username}.`);
                else {
                    let viewnotesembed = new Discord.MessageEmbed()
                        .setColor('#00ffbb')
                        .setTitle(`${member.user.username}'s notes`)
                        .setDescription(notes)
                        .setTimestamp();
                    message.author.send(viewnotesembed);
                }
            }
    }
}