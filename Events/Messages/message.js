const Discord = require('discord.js');
const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);
const suggestionChannels = new Keyv(process.env.suggestionChannels);
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

  let prefix = await prefixes.get(`${message.guild.id}`) || defaultPrefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = client.commands.get(args.shift().toLowerCase());

  if (!command) return;

  if (command.requiredPerms && !message.member.hasPermission(command.requiredPerms)) {
    let msg = await message.channel.send(command.permError);
    msg.delete({ timeout: deletionTimeout });
    return message.react(reactionError);
  }

  command.execute(message, args, prefix);
}