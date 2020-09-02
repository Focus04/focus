const Discord = require("discord.js");
const Keyv = require('keyv');
const rolepickers = new Keyv(process.env.rolepickers);

module.exports = {
    name: 'rolepicker',
    description: 'Creates a menu that automatically assigns roles to users that react to it.',
    usage: 'rolepicker @`role` emoji @`role` emoji @`role` emoji etc. (maximum 25)',
    guildOnly: true,
    async execute(message, args, prefix) {
        let roles = [];
        let emojis = [];
        let err = 0;
        args.forEach(async arg => {
            if (args.indexOf(arg) % 2 == 0 && arg.startsWith('<@&') && arg.endsWith('>') && arg.length == 22) {
                let role = message.guild.roles.cache.get(arg.substring(3, 21));
                let bothighestrole = -1;
                message.guild.me.roles.cache.forEach(r => {
                    if (r.position > bothighestrole)
                        bothighestrole = r.position;
                })
                if (role.position >= bothighestrole) {
                    err = 1;
                    let msg = await message.channel.send(`Error at role ${'`' + role.name + '`'}. My roles must be higher than the role that you want to set.`);
                    return msg.delete({ timeout: 10000 });
                }
                let highestrole = -1;
                message.member.roles.cache.forEach(r => {
                    if (r.position > highestrole)
                        highestrole = r.position;
                });
                if (role.position >= highestrole) {
                    err = 1;
                    let msg = await message.channel.send(`Error at role ${'`' + role.name + '`'}. Your roles must be higher than the role that you want to set.`);
                    return msg.delete({ timeout: 10000 });
                }
                roles.push(role);
            }
            if (args.indexOf(arg) % 2 == 1 && !arg.startsWith('<@&')) {
                emojis.push(arg);
            }
        });
        if (err == 1)
            return;
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            let msg = await message.channel.send('I require the Manage Roles permission in order to execute this command.');
            return msg.delete({ timeout: 10000 });
        }
        if (!args[1] || roles.length != args.length / 2 || emojis.length != args.length / 2 || args.length > 25) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}rolepicker @[role] emoji @[role] emoji @[role] emoji etc. (maximum 25)`);
            return msg.delete({ timeout: 10000 });
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.chanel.send('You require the Manage Server permission in order to run this command!');
            return msg.delete({ timeout: 10000 });
        }
        let mappings = new Map();
        let rolepicker = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle('Role Picker')
            .setDescription('React to assign yourself a role!')
            .setTimestamp();
        let i = 0;
        roles.forEach(role => {
            rolepicker.addField(role.name, emojis[i]);
            mappings.set(emojis[i], role.id);
            i++;
        });
        let menu = await message.channel.send(rolepicker);
        emojis.forEach(emoji => {
            menu.react(emoji);
        });
        message.delete();
        let object = Object.fromEntries(mappings);
        await rolepickers.set(`${message.guild.id}_${menu.id}`, object);
    }
}