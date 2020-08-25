const Discord = require('discord.js');
const Keyv = require('keyv');
const warnings = new Keyv(process.env.wrns);
const bns = new Keyv(process.env.bns);
const kks = new Keyv(process.env.kks);
const mts = new Keyv(process.env.mts);

module.exports = {
    name: 'record',
    description: `Displays how many punishments a user has ever received on the server.`,
    usage: 'record @`user`',
    guildOnly: true,
    async execute(message, prefix) {
        let member = message.mentions.users.first();
        if (!member) {
            message.channel.send(`Proper command usage: ${prefix}record @[user]`);
            return message.react('❌');
        }
        if (!message.member.hasPermission('KICK MEMBERS') || !message.guild.member(member).kickable) {
            message.channel.send('You need the Kick Members permission in order to run this command. In case you have it, make sure that my role is higher than the role of the person you want to check the record for!');
            return message.react('❌');
        }
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