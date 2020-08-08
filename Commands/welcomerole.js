const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const welcomeroles = new Keyv(database.welcomeroles);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'welcomerole',
    description: `Sets a role to be assigned to new users when they join the server.`,
    usage: 'welcomerole `role`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(`${message.guild.id}`);
        let rolename = args.join(' ');
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            message.channel.send('I need the Manage Roles permission in order to execute this command!');
            return message.react('❌');
        }
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}welcomerole [role]`);
            message.react('❌');
        }
        else {
            let welcomerole = message.guild.roles.cache.find(role => role.name === `${rolename}`);
            if (!welcomerole) {
                message.channel.send(`Couldn't find any roles named "${rolename}"`);
                message.react('❌');
            }
            else {
                let bothighestrole = -1;
                message.guild.me.roles.cache.map(r => {
                    if (r.position > bothighestrole)
                        bothighestrole = r.position;
                })
                if (welcomerole.position >= bothighestrole) {
                    message.channel.send('My roles must be higher than the role that you want to give!');
                    return message.react('❌');
                }
                let highestrole = -1;
                message.member.roles.cache.map(r => {
                    if (r.position > highestrole)
                        highestrole = r.position;
                });
                if (welcomerole.position >= highestrole) {
                    message.channel.send('Your roles must be higher than the role that you want to give. In case they are, make sure that my role is higher than the role of the member you want to give a role to!');
                    message.react('❌');
                }
                else
                    if (!message.member.hasPermission('MANAGE_ROLES')) {
                        message.channel.send('You lack permissions to run this command!');
                        message.react('❌');
                    }
                    else {
                        await welcomeroles.set(`welcomerole_${message.guild.id}`, rolename);
                        message.react('✔️');
                        let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                        let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                        if(!log)
                            message.channel.send(`Welcome role successfully changed to ${'`' + rolename + '`'}`);
                        else
                            log.send(`Welcome role successfully changed to ${'`' + rolename + '`'}`);
                    }
            }
        }
    }
}