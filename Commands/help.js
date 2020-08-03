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
            const helpembed = new Discord.MessageEmbed()
                .setColor('#00ffbb')
                .setTitle('Commands')
                .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
                .addFields(
                    { name: `${message.client.emojis.cache.get('729353638132318318').toString()} Staff Commands`, value: `${'```' + `${prefix}report, ${prefix}ban, ${prefix}unban, ${prefix}kick, ${prefix}mute, ${prefix}unmute, ${prefix}warn, ${prefix}record, ${prefix}giverole, ${prefix}takerole, ${prefix}addnote, ${prefix}viewnotes, ${prefix}clear` + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353637985517568').toString()} Info Commands`, value: `${'```' + `${prefix}help, ${prefix}serverinfo, ${prefix}userinfo, ${prefix}avatar` + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638056689735').toString()} Logging Commands`, value: `${'```' + `${prefix}setlogschanel, ${prefix}togglemsglogs` + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638211878923').toString()} Welcome Comamnds`, value: `${'```' + `${prefix}setwelcomechannel, ${prefix}welcomerole, ${prefix}welcomemessage, ${prefix}togglewelcomemsg, ${prefix}welcomedm, ${prefix}togglewelcomedm, ${prefix}setleavechannel, ${prefix}leavemessage, ${prefix}toggleleavemsg` + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729355859552895026').toString()} Fun Commands`, value: `${'```' + `${prefix}weather, ${prefix}define, ${prefix}dogfact, ${prefix}catfact, ${prefix}nasanews` + '```'}`, inline: true },
                    { name: `${message.client.emojis.cache.get('729353638736166932').toString()} Debug Commands`, value: `${'```' + `${prefix}bugreport, ${prefix}setprefix, ${prefix}ping, ${prefix}invitelink, ${prefix}discordserver` + '```'}`, inline: true },
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