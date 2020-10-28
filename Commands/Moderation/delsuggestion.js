const Keyv = require('keyv');
const suggestionChannels = new Keyv(process.env.suggestionChannels);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'delsuggestion',
  description: 'Deletes a suggestion.',
  usage: 'delsuggestion `messageID`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if(args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}delsuggestion [messageID]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    let error;
    let suggestionChName = await suggestionChannels.get(message.guild.id);
    let suggestionChannel = message.guild.channels.cache.find((ch) => ch.name === suggestionChName);
    let suggestion = await suggestionChannel.messages.fetch(args[0]).catch((err) => error = err);
    if(error) {
      let msg = await message.channel.send(`Couldn't find any messages with the of ${'`' + args[0] + '`'}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await suggestionChannel.messages.delete(suggestion);
    message.channel.send(`Suggestion ${'`' + args[0] + '`'} has been successfully deleted.`);
    message.react(reactionSuccess);
  }
}