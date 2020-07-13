const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'giverole',
    description: `Adds a role to a user.`,
    usage: 'giverole @`member` `role`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(`${message.guild.id}`);
        if (!prefix)
            prefix = '/';
        let member = message.mentions.members.first();
        let rolename = [];
        for (let i = 1; i < args.length; i++)
            rolename = rolename + args[i] + ' ';
        if (!message.guild.me.hasPermission('MANAGE_ROLES') || !message.guild.member(member).kickable)
            return message.channel.send('I need the Manage Roles permission in order to execute this command.');
        if (!args[1])
            message.channel.send(`Proper command usage: ${prefix}giverole @[member] [role]`);
        else {
            let role = message.guild.roles.cache.find(role => role.name + ' ' === `${rolename}`);
            if (!role)
                message.channel.send(`Couldn't find any roles named ${rolename}`);
            else
                if (!message.member.hasPermission('MANAGE_ROLES'))
                    message.channel.send('You need the Manage Roles permission in order to run this command!');
                else {
                    let highestrole = 1000;
                    message.member.roles.cache.map(r => {
                        if (r.position < highestrole)
                            highestrole = r.position;
                    });
                    if (role.position <= highestrole)
                        message.channel.send('Your roles must be higher than the role that you want to give. In case they are, make sure that my role is higher than the role of the member you want to give a role to!');
                    else {
                        member.roles.add(role);
                        let perms = role.permissions.toArray().map(perm => perm).join(`\n`);
                        perms = '```' + perms + '```';
                        let giveroleembed = new Discord.MessageEmbed()
                            .setColor('#00ffbb')
                            .setTitle('Given Role')
                            .addFields(
                                { name: 'To', value: `${member}` },
                                { name: 'By', value: `${message.author.username}` },
                                { name: 'Role', value: `${rolename}` },
                                { name: 'Permissions', value: `${perms}` }
                            )
                            .setTimestamp();
                        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                        if (log)
                            log.send(giveroleembed);
                        else
                            message.channel.send(giveroleembed);
                    }
                }
        }
    }
}