const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'help',
  description: 'Displays a list of all available commands along with their usage.',
  usage: 'help `(command)`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args.length) {
      let debugCmds = '';
      let funCmds = '';
      let infoCmds = '';
      let loggingCmds = '';
      let staffCmds = '';
      let welcomeCmds = '';
      fs.readdirSync('./Commands/Debug').forEach((file) => debugCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);
      fs.readdirSync('./Commands/Fun').forEach((file) => funCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);
      fs.readdirSync('./Commands/Info').forEach((file) => infoCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);
      fs.readdirSync('./Commands/Logging').forEach((file) => loggingCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);
      fs.readdirSync('./Commands/Moderation').forEach((file) => staffCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);
      fs.readdirSync('./Commands/Welcome').forEach((file) => welcomeCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `);

      const helpEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('Commands')
        .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
        .addFields(
          { name: `${message.client.emojis.cache.get('729353638132318318').toString()} Staff Commands`, value: `${'```' + staffCmds + '```'}`, inline: true },
          { name: `${message.client.emojis.cache.get('729353637985517568').toString()} Info Commands`, value: `${'```' + infoCmds + '```'}`, inline: true },
          { name: `${message.client.emojis.cache.get('729353638056689735').toString()} Logging Commands`, value: `${'```' + loggingCmds + '```'}`, inline: true },
          { name: `${message.client.emojis.cache.get('729353638211878923').toString()} Welcome Comamnds`, value: `${'```' + welcomeCmds + '```'}`, inline: true },
          { name: `${message.client.emojis.cache.get('729355859552895026').toString()} Fun Commands`, value: `${'```' + funCmds + '```'}`, inline: true },
          { name: `${message.client.emojis.cache.get('729353638736166932').toString()} Debug Commands`, value: `${'```' + debugCmds + '```'}`, inline: true },
          { name: '`Useful Links`', value: '[Support Server](https://discord.gg/YvN7jUD), [Add me on your server](https://discordapp.com/oauth2/authorize?client_id=723094801175806024&scope=bot&permissions=268561494)' }
        )
        .setTimestamp();
      message.channel.send(helpEmbed);
    } else {
      const { commands } = message.client;
      const name = args[0].toLowerCase();
      const command = commands.get(name);
      if (!command) {
        let msg = await message.channel.send(`Couldn't find ${args[0]} in my commands list.`);
        msg.delete({ timeout: 10000 });
        return message.react('❌');
      }
      else {
        const commandEmbed = new Discord.MessageEmbed()
          .setColor('#00ffbb')
          .setTitle(`${prefix}${command.name}`)
          .addFields(
            { name: '`Command Description:`', value: `${command.description}` },
            { name: '`Command Usage:`', value: `${prefix}${command.usage}` },
          )
          .setTimestamp();
        message.channel.send(commandEmbed);
      }
    }
  }
}