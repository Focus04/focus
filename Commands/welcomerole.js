const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const welcomeroles = new Keyv(database.welcomeroles);
module.exports = {
    name: 'welcomerole',
    description: `Sets a role to be assigned to new users when they join the server.`,
    usage: 'welcomerole `role`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(`${message.guild.id}`);
        let rolename = args.join(' ');
        if (!message.guild.me.hasPermission('MANAGE_ROLES'))
            return message.channel.send('I need the Manage Roles permission in order to execute this command!');
        if (!args[0])
            message.channel.send(`Proper command usage: ${prefix}welcomerole [role]`);
        else {
            let welcomerole = message.guild.roles.cache.find(role => role.name === `${rolename}`);
            if (!welcomerole)
                message.channel.send(`Couldn't find any roles named "${rolename}"`);
            else {
                let bothighestrole = -1;
                message.guild.me.roles.cache.map(r => {
                    if (r.position > bothighestrole)
                        bothighestrole = r.position;
                })
                if (role.position >= bothighestrole)
                    return message.channel.send('My roles must be higher than the role that you want to give!');
                let highestrole = -1;
                message.member.roles.cache.map(r => {
                    if (r.position > highestrole)
                        highestrole = r.position;
                });
                if (role.position >= highestrole)
                    message.channel.send('Your roles must be higher than the role that you want to give. In case they are, make sure that my role is higher than the role of the member you want to give a role to!');
                else {
                    if (!message.member.hasPermission('MANAGE_ROLES'))
                        message.channel.send('You lack permissions to run this command!');
                    else {
                        await welcomeroles.set(`welcomerole_${message.guild.id}`, rolename);
                        message.channel.send(`Welcome role successfully changed to ${rolename}`);
                }
                }
            }
        }
    }
}