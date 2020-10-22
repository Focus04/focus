const Discord = require('discord.js');
const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.suggestionChannels);
const { deletionTimeout, reactionError, reactionSuccess, suggestionAccepted, suggestionDeclined } = require('../../config.json');

module.exports = {
  name: 'suggestion',
  description: 'Accept or decline a suggestion from your suggestion channel.',
  usage: 'suggestion `accept`/`decline` `messageID`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[1] || (args[0].toLowerCase() !== 'accept' && args[0].toLowerCase() !== 'decline') || isNaN(args[1])) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}suggestion [accept]/[decline] [messageID]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const suggestionChName = await suggestionChannels.get(message.guild.id);
    const suggestionChannel = message.guild.channels.cache.find((ch) => ch.name === suggestionChName);
    if(!suggestionChannel) {
      let msg = await message.channel.send(`This server doesn't have a suggestion channel yet. Set one by using ${prefix}suggestionchannel`);
      msg.delete({ timeout: deletionTimeout });
      message.react(reactionError);
    }

    let error;
    let state;
    const suggestionMessage = await suggestionChannel.messages.fetch(args[1]).catch((err) => error = err);
    if (error) {
      let msg = await message.channel.send(`Couldn't find any suggestions with the id of ${'`' + args[1] + '`'}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const oldSuggestionEmbed = suggestionMessage.embeds[0];
    if(args[0].toLowerCase() === 'accept') {
      const newSuggestionEmbed = new Discord.MessageEmbed()
        .setColor(suggestionAccepted.color)
        .setTitle(oldSuggestionEmbed.title)
        .setDescription(oldSuggestionEmbed.description)
        .addField(suggestionAccepted.statusTitle, suggestionAccepted.status);
      suggestionMessage.edit(newSuggestionEmbed);
      state = 'approved';
    } else if (args[0].toLowerCase() === 'decline') {
      const newSuggestionEmbed = new Discord.MessageEmbed()
        .setColor(suggestionDeclined.color)
        .setTitle(oldSuggestionEmbed.title)
        .setDescription(oldSuggestionEmbed.description)
        .addField(suggestionDeclined.statusTitle, suggestionDeclined.status);
      suggestionMessage.edit(newSuggestionEmbed);
      state = 'declined';
    }

    await message.channel.send(`Suggestion successfully ${state}.`);
    message.react(reactionSuccess);
  }
}