const Keyv = require('keyv');
const logchannels = new Keyv(process.env.logchannels);

module.exports = {
    name: 'unmute',
    description: `Removes a user's muted status earlier.`,
    usage: 'mute @`user`',
    guildOnly: true,
    async execute(message, args, prefix) {
        let author = message.author.username;
        let member = message.mentions.members.first();
        let mutedrole = message.guild.roles.cache.find(r => r.name === 'Muted Member');
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            let msg = await message.channel.send('I require the Manage Roles permission in order to perform this action!');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!member) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}unmute @[user]`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('KICK_MEMBERS') || !message.guild.member(member).kickable) {
            let msg = await message.channel.send(`It appears that you lack permissions to unmute.  In case you have them, make sure that my role is higher than the role of the person you want to unmute!`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!member.roles.cache.has(mutedrole.id)) {
            let msg = await message.channel.send(`${member} isn't muted!`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        member.roles.remove(mutedrole);
        message.react('✔️');
        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
        if (!log)
            message.channel.send(`${args[0]} has been unmuted earlier.`);
        else
            log.send(`${args[0]} has been unmuted earlier.`);
        member.send(`${author} unmuted you earlier from ${message.guild.name}.`);
    }
}