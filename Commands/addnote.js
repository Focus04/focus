const Discord = require('discord.js');
const moment = require('moment');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const nts = new Keyv(database.notes);
module.exports = {
    name: 'addnote',
    description: `Adds an admin note on someone's account. All staff members will be able to view this note.`,
    usage: 'addnote `username` `note`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let member = message.guild.members.cache.find(user => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`);
        if(!member){
            await message.author.send(`Couldn't find ${args[0]}.`);
            message.channel.bulkDelete(1);
            return;
        }
        if (!args[1])
            message.channel.send(`Proper command usage: ${prefix}addnote [username] [note]`);
        else
            if (!message.member.hasPermission('KICK_MEMBERS'))
                message.channel.send('You need the Kick Members permission in order to run this command.');
            else {
                args.shift();
                let note = '```' + args.join(' ') + '```';
                let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
                if (!notes)
                    notes = note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LT')} ${moment(message.createdTimestamp).format('LL')}\n`;
                else
                    notes = notes + note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LT')} ${moment(message.createdTimestamp).format('LL')}\n`;
                await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
                await message.author.send(`Note successfully added on ${member}'s account`);
                message.channel.bulkDelete(1);
            }
    }
}