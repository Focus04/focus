const Discord = require('discord.js');
const fs = require('fs');
const { helpEmojis, urls, deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'help',
  description: 'Displays a list of all available commands along with their usage.',
  usage: 'help `(command)`',
  async execute(message, args, prefix) {
    const { staffEmojiId, infoEmojiId, loggingEmojiId, welcomeEmojiId, funEmojiId, debugEmojiId } = helpEmojis;
    const { botInviteLink, discordInviteLink, topgg, website, github } = urls;
    let color = getRoleColor(message.guild);
    if (!args.length) {
      let debugCmds = '';
      let funCmds = '';
      let infoCmds = '';
      let loggingCmds = '';
      let staffCmds = '';
      let welcomeCmds = '';
      fs.readdirSync('./Commands/Debug').forEach((file) => {
        debugCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });
      fs.readdirSync('./Commands/Fun').forEach((file) => {
        funCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });
      fs.readdirSync('./Commands/Info').forEach((file) => {
        infoCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });
      fs.readdirSync('./Commands/Logging').forEach((file) => {
        loggingCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });
      fs.readdirSync('./Commands/Moderation').forEach((file) => {
        staffCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });
      fs.readdirSync('./Commands/Welcome').forEach((file) => {
        welcomeCmds += `${prefix}${file.slice(0, file.lastIndexOf('.'))} `;
      });

      const helpEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Commands')
        .setDescription(`Pro tip: Type "${prefix}help [command]" for more detailed information about a specific command.`)
        .addFields(
          {
            name: `${message.client.emojis.cache.get(staffEmojiId).toString()} Staff Commands`,
            value: `${'```' + staffCmds + '```'}`, inline: true
          },
          {
            name: `${message.client.emojis.cache.get(infoEmojiId).toString()} Info Commands`,
            value: `${'```' + infoCmds + '```'}`, inline: true
          },
          {
            name: `${message.client.emojis.cache.get(loggingEmojiId).toString()} Logging Commands`,
            value: `${'```' + loggingCmds + '```'}`, inline: true
          },
          {
            name: `${message.client.emojis.cache.get(welcomeEmojiId).toString()} Welcome Comamnds`,
            value: `${'```' + welcomeCmds + '```'}`, inline: true
          },
          {
            name: `${message.client.emojis.cache.get(funEmojiId).toString()} Fun Commands`,
            value: `${'```' + funCmds + '```'}`, inline: true
          },
          {
            name: `${message.client.emojis.cache.get(debugEmojiId).toString()} Debug Commands`,
            value: `${'```' + debugCmds + '```'}`, inline: true
          },
          {
            name: '`Useful Links`',
            value: `[Support Server](${discordInviteLink}), [Add me on your server](${botInviteLink}), [Vote!](${topgg}), [Website](${website}), [Code](${github})`
          }
        )
        .setTimestamp();
      message.channel.send(helpEmbed);
    } else {
      const { commands } = message.client;
      const name = args[0].toLowerCase();
      const command = commands.get(name);
      if (!command) {
        let msg = await message.channel.send(`Couldn't find ${args[0]} in my commands list.`);
        msg.delete({ timeout: deletionTimeout });
        return message.react(reactionError);
      } else {
        const commandEmbed = new Discord.MessageEmbed()
          .setColor(color)
          .setTitle(`${prefix}${command.name}`)
          .addFields(
            { name: '`Command Description:`', value: `${command.description}` },
            { name: '`Command Usage:`', value: `${prefix}${command.usage}` },
          )
          .setTimestamp();
        await message.channel.send(commandEmbed);
        message.react(reactionSuccess);
      }
    }
  }
}