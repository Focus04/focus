const Discord = require('discord.js');
const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.suggestionChannels);
const disabledCmds = new Keyv(process.env.disabledcmds);
const { defaultPrefix, deletionTimeout, reactionError, suggestionPending, suggestionApprove, suggestionDecline } = require('../../config.json');

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type !== 'text') return;
  const suggestionChannelName = await suggestionChannels.get(message.guild.id);
  const channel = message.guild.channels.cache.find(ch => ch.name === suggestionChannelName);
  if (channel && message.channel.id === channel.id && !message.author.bot) {
    const suggestionEmbed = new Discord.MessageEmbed()
      .setColor(suggestionPending.color)
      .setTitle(`Suggestion by ${message.author.tag}`)
      .setDescription('```' + message.content + '```')
      .addField(suggestionPending.statusTitle, suggestionPending.status);
    const suggestion = await message.channel.send(suggestionEmbed);
    await suggestion.react(suggestionApprove);
    await suggestion.react(suggestionDecline);
    return message.delete();
  }

  const { prefix = defaultPrefix } = client.guildConfigs.get(message.guild.id);

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = client.commands.get(args.shift().toLowerCase());

  if (!command) return;

  let err = 0;
  if (command.requiredPerms) {
    command.requiredPerms.forEach(async (perm) => {
      if (!message.member.hasPermission(perm)) {
        err = 1;
        let msg = await message.channel.send(`You need the following permission to run this: ${'`' + perm + '`'}`);
        msg.delete({ timeout: deletionTimeout });
        message.react(reactionError);
      }
    });
  }

  if (command.botRequiredPerms) {
    command.botRequiredPerms.forEach(async (perm) => {
      if (!message.guild.me.hasPermission(perm)) {
        err = 1;
        let msg = await message.channel.send(`I need the following permission to run this: ${'`' + perm + '`'}`);
        msg.delete({ timeout: deletionTimeout });
        message.react(reactionError);
      }
    });
  }

  if (err) return;

  const disabledCommands = await disabledCmds.get(message.guild.id);
  if (disabledCommands && disabledCommands.includes(command.name)) {
    let msg = await message.channel.send('This command is currently disabled.');
    msg.delete({ timeout: deletionTimeout });
    return message.react(reactionError);
  }

  command.execute(message, args, prefix);
}