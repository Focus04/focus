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
        let role = args.join(' ');
        if(!message.guild.me.hasPermission('MANAGE_ROLES'))
            return message.channel.send('I need the Manage Roles permission in order to execute this command!');
        if(!args[0])
            message.channel.send(`Proper command usage: ${prefix}welcomerole [role]`);
        else{
            let rolename = await welcomeroles.get(`welcomerole_${message.guild.id}`);
            let welcomerole = message.guild.roles.cache.find(role => role.name === `${rolename}`);
            if(!welcomerole)
                message.channel.send(`Couldn't find any roles named "${role}"`);
            else
                if(!message.member.hasPermission('MANAGE_ROLES'))
                    message.channel.send('You lack permissions to run this command!');
                else{
                    await welcomeroles.set(`welcomerole_${message.guild.id}`, role);
                    message.channel.send(`Welcome role successfully changed to ${role}`);
                }
        }
    }
}