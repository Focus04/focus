const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'Displays a list of all available commands along with their usage.',
    usage: 'help `(command)`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args.length) {
            let debugcmds;
            fs.readdirSync('../Debug').forEach(file => {
                debugcmds += `${prefix}${file} `;
            });
            let funcmds;
            fs.readdirSync('../Fun').forEach(file => {
                funcmds += `${prefix}${file} `;
            });
            let infocmds;
            fs.readdirSync('../Info').forEach(file => {
                infocmds += `${prefix}${file} `;
            });
            let loggingcmds;
            fs.readdirSync('../Logging').forEach(file => {
                loggingcmds += `${prefix}${file} `;
            });
            let staffcmds;
            fs.readdirSync('../Moderation').forEach(file => {
                staffcmds += `${prefix}${file} `;
            });
            let welcomecmds;
            fs.readdirSync('../Welcome').forEach(file => {
                welcomecmds += `${prefix}${file} `;
            });
            const helpembed = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle('Commands')
                .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
                .addFields(
                    { name: `${message.client.emojis.cache.get('729353638132318318').toString()} Staff Commands`, value: staffcmds },
                    { name: `${message.client.emojis.cache.get('729353637985517568').toString()} Info Commands`, value: infocmds },
                    { name: `${message.client.emojis.cache.get('729353638056689735').toString()} Logging Commands`, value: loggingcmds },
                    { name: `${message.client.emojis.cache.get('729353638211878923').toString()} Welcome Comamnds`, value: welcomecmds },
                    { name: `${message.client.emojis.cache.get('729355859552895026').toString()} Fun Commands`, value: funcmds },
                    { name: `${message.client.emojis.cache.get('729353638736166932').toString()} Debug Commands`, value: debugcmds },
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