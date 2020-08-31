const Discord = require("discord.js");

module.exports = {
    name: 'rolepicker',
    description: 'Creates a menu that automatically assigns roles to users that react to it.',
    usage: 'rolepicker @`role` emoji @`role` emoji @`role` emoji etc. (maximum 25)',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
            let msg = await message.channel.send('I require the Manage Roles permission in order to execute this command.');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!args[1] || args.length > 25) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}rolepicker @[role] emoji @[role] emoji @[role] emoji etc. (maximum 25)`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.chanel.send('You require the Manage Server permission in order to run this command!');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let roles = [];
        let emojis = [];
        args.forEach(arg => {
            if(args.indexOf(arg) % 2 == 0) {
                if(!role.id) {
                    let msg = await message.channel.send(`Invalid role ${arg}.`);
                    msg.delete({timeout: 10000});
                    return message.react('❌');
                }
                roles.push(arg);
            }
            else {
                emojis.push(arg);
            }
        });
        console.log(roles + '\n' + emojis);
    }
}