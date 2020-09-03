const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Displays a list of all available commands along with their usage.',
    usage: 'help `(command)`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args.length) {
            let debugcmds = '';
            fs.readdirSync('./Commands/Debug').forEach(file => {
                debugcmds += `${prefix}${file.slice(1, indexOf('.'))}, `;
            });
            let funcmds = '';
            fs.readdirSync('./Commands/Fun').forEach(file => {
                funcmds += `${prefix}${file}, `;
            });
            let infocmds = '';
            fs.readdirSync('./Commands/Info').forEach(file => {
                infocmds += `${prefix}${file}, `;
            });
            let loggingcmds = '';
            fs.readdirSync('./Commands/Logging').forEach(file => {
                loggingcmds += `${prefix}${file}, `;
            });
            let staffcmds = '';
            fs.readdirSync('./Commands/Moderation').forEach(file => {
                staffcmds += `${prefix}${file}, `;
            });
            let welcomecmds = '';
            fs.readdirSync('./Commands/Welcome').forEach(file => {
                welcomecmds += `${prefix}${file}, `;
            });
            const helpembed = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle('Commands')
                .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
                .addFields(
                    { name: `${message.client.emojis.cache.get('729353638132318318').toString()} Staff Commands`, value: `${'```' + staffcmds + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353637985517568').toString()} Info Commands`, value: `${'```' + infocmds + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638056689735').toString()} Logging Commands`, value: `${'```' + loggingcmds + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638211878923').toString()} Welcome Comamnds`, value: `${'```' + welcomecmds + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729355859552895026').toString()} Fun Commands`, value: `${'```' + funcmds + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638736166932').toString()} Debug Commands`, value: `${'```' + debugcmds + '```'}`, inline: true },
                    { name: '`Useful Links`', value: '[Support Server](https://discord.gg/YvN7jUD), [Add me on your server](https://discordapp.com/oauth2/authorize?client_id=723094801175806024&scope=bot&permissions=268561494)' }
                )
                .setTimestamp();
            message.channel.send(helpembed);
        }
        else {
            const { commands } = message.client;
            const name = args[0].toLowerCase();
            const command = commands.get(name);
            if (!command)
                message.channel.send(`Couldn't find ${args[0]} in my commands list.`);
            else {
                const commandembed = new Discord.MessageEmbed()
                    .setColor('#00ffbb')
                    .setTitle(`${prefix}${command.name}`)
                    .addFields(
                        { name: '`Command Description:`', value: `${command.description}` },
                        { name: '`Command Usage:`', value: `${prefix}${command.usage}` },
                    )
                    .setTimestamp();
                message.channel.send(commandembed);
            }
        }
    }
}