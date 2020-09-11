const Discord = require('discord.js');
const Keyv = require('keyv');
const warnings = new Keyv(process.env.wrns);
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
    name: 'warn',
    description: `Sends a warning message to a user.`,
    usage: 'warn @`user` `reason`',
    guildOnly: true,
    async execute(message, args, prefix) {
        let member = message.mentions.users.first();
        let author = message.author.username;
        if (!member || !args[1]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}warn @[user] [reason]`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('KICK_MEMBERS')) {
            let msg = await message.channel.send('You need the Kick Members permission in order to run this command.');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (member.id == message.author.id) {
            let msg = await message.channel.send(`You can't warn youself, smarty pants!`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        args.shift();
        let reason = '`' + args.join(' ') + '`';
        let warns = await warnings.get(`warns_${member.id}_${message.guild.id}`);
        if (!warns)
            warns = 1;
        else
            warns = warns + 1;
        const warnembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Warn Information`)
            .addFields(
                { name: `Defendant's name:`, value: `${member}` },
                { name: `Issued by:`, value: `${author}` },
                { name: 'Reason:', value: `${reason}` }
            )
            .setTimestamp();
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = await message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(warnembed);
        else
            log.send(warnembed);
        await member.send(`${author} is warning you in ${message.guild.name} for ${reason}.`);
        await warnings.set(`warns_${member.id}_${message.guild.id}`, warns);
        message.react('✔️');
    }
}