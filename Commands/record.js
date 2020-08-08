const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const warnings = new Keyv(database.warnings);
const bns = new Keyv(database.bns);
const kks = new Keyv(database.kks);
const mts = new Keyv(database.mts);
module.exports = {
    name: 'record',
    description: `Displays how many punishments a user has ever received on the server.`,
    usage: 'record @`user`',
    guildOnly: true,
    async execute(message, args) {
        let member = message.mentions.users.first();
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!member) {
            message.channel.send(`Proper command usage: ${prefix}record @[user]`);
            message.react('❌');
        }
        else
            if (!message.member.hasPermission('KICK MEMBERS') || !message.guild.member(member).kickable) {
                message.channel.send('You need the Kick Members permission in order to run this command. In case you have it, make sure that my role is higher than the role of the person you want to check the record for!');
                message.react('❌');
            }
            else {
                let warns = await warnings.get(`warns_${member.id}_${message.guild.id}`);
                let kicks = await kks.get(`kicks_${member.id}_${message.guild.id}`);
                let mutes = await mts.get(`mutes_${member.id}_${message.guild.id}`);
                let bans = await bns.get(`bans_${member.id}_${message.guild.id}`);
                if (!warns)
                    warns = 0;
                if (!kicks)
                    kicks = 0;
                if (!mutes)
                    mutes = 0;
                if (!bans)
                    bans = 0;
                const recordembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle(`${member.username}'s record`)
                    .addFields(
                        { name: 'Times warned', value: `${warns}` },
                        { name: 'Times kicked', value: `${kicks}` },
                        { name: 'Times muted', value: `${mutes}` },
                        { name: 'Times banned', value: `${bans}` }
                    )
                    .setTimestamp();
                message.react('✔️');
                message.channel.send(recordembed);
            }
    }
}