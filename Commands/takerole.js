const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'takerole',
    description: `Deletes a role from a user.`,
    usage: 'takerole @`member` `role`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(`${message.guild.id}`);
        let member = message.mentions.members.first();
        let rolename = [];
        for(let i=1;i<args.length;i++)
            rolename = rolename + args[i] + ' ';
        if (!message.guild.me.hasPermission('MANAGE_ROLES'))
            return message.channel.send('I need the Manage Roles permission in order to execute this command!');
        if (!args[1])
            message.channel.send(`Proper command usage: ${prefix}takerole @[member] [role]`);
        else {
            let role = member.roles.cache.find(role => role.name + ' ' === `${rolename}`);
            if (!role)
                message.channel.send(`${member.username} doesn't have any roles named ${rolename}`);
            else
                if (!message.member.hasPermission('MANAGE_ROLES'))
                    message.channel.send('You need the Manage Roles permission in order to run this command!');
                else {
                    member.roles.remove(role);
                    let perms = role.permissions.toArray().map(perm => perm).join(`\n`);
                    perms = '```' + perms + '```';
                    let takeroleembed = new Discord.MessageEmbed()
                        .setColor('#00ffbb')
                        .setTitle('Deleted Role')
                        .addFields(
                            { name: 'From', value: `${member}`},
                            { name: 'By', value: `${message.author.username}`},
                            { name: 'Role', value: `${rolename}`},
                            { name: 'Permissions', value: `${perms}`}
                        )
                        .setTimestamp();
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if(log)
                        log.send(takeroleembed);
                    else
                        message.channel.send(takeroleembed);
                }
        }
    }
}