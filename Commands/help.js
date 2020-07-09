const Discord = require('discord.js');
const fs = require('fs');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
module.exports = {
    name: 'help',
    description: 'Displays a list of all available commands along with their usage.',
    usage: 'help `(command)`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!args.length) {
            let modemoji = message.client.emojis.cache.get('729353638132318318').toString();
            let modcmds = '```' + `${prefix}report, ${prefix}ban, ${prefix}unban, ${prefix}kick, ${prefix}mute, ${prefix}unmute, ${prefix}warn, ${prefix}record, ${prefix}addnote, ${prefix}viewnotes, ${prefix}clear` + '```';
            let infoemoji = message.client.emojis.cache.get('729353637985517568').toString();
            let infocmds = '```' + `${prefix}help, ${prefix}serverinfo, ${prefix}userinfo, ${prefix}avatar` + '```';
            let logemoji = message.client.emojis.cache.get('729353638056689735').toString();
            let logcmds = '```' + `${prefix}setlogschanel, ${prefix}togglemsglogs` + '```';
            let welcomeemoji = message.client.emojis.cache.get('729353638211878923').toString();
            let welcomecmds = '```' + `${prefix}setwelcomechannel, ${prefix}welcomemessage, ${prefix}setleavechannel, ${prefix}leavemessage` + '```';
            let funemoji = message.client.emojis.cache.get('729355859552895026').toString();
            let funcmds = '```' + `${prefix}weather, ${prefix}define, ${prefix}dogfact, ${prefix}catfact, ${prefix}nasanews` + '```';
            let debugemoji = message.client.emojis.cache.get('729353638736166932').toString();
            let debugcmds = '```' + `${prefix}bugreport, ${prefix}setprefix, ${prefix}ping, ${prefix}invitelink, ${prefix}discordserver` + '```';
            const helpembed = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle('Commands')
                .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
                .addFields(
                    { name: `${modemoji} Staff Commands`, value: `${modcmds}`, inline: true },
                    { name: `${infoemoji} Info Commands`, value: `${infocmds}`, inline: true },
                    { name: `${logemoji} Logging Commands`, value: `${logcmds}`, inline: true },
                    { name: `${welcomeemoji} Welcome Comamnds`, value: `${welcomecmds}`, inline: true },
                    { name: `${funemoji} Fun Commands`, value: `${funcmds}`, inline: true },
                    { name: `${debugemoji} Debug Commands`, value: `${debugcmds}`, inline: true },
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