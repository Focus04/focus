const Discord = require("discord.js");

module.exports = {
    name: 'rolepicker',
    description: 'Creates a menu that automatically assigns roles to users that react to it.',
    usage: 'rolepicker `role` `role` `role` etc. (maximum 25)',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[1] || args.length > 25) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}rolepicker [role] [role] [role] etc. (maximum 25)`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.chanel.send('You require the Manage Server permission in order to run this command!');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let msg = message.channel.send('Please react to your message with the emojis you would like to have as reactions within 1 min');
        setTimeout(async function () {
            let rolepicker = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle('Role Picker')
                .setDescription('React to assign yourself a role!')
                .setTimestamp();
            let i = 0;
            message.reactions.cache.forEach(reaction => {
                rolepicker.addField({ name: `${args[i]}`, value: `React with ${reaction}` });
                i++;
            });
            let picker = await message.channel.send(rolepicker);
            message.reactions.cache.forEach(reaction => {
                picker.react(reaction);
            });
            message.delete;
            msg.delete;
        }, 60000);
    }
}