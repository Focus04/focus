const { deletionTimeout, reactionError, reactionSuccess, suggestionChId, discordInviteLink } = require('../../config.json');

module.exports = {
  name: 'botsuggestion',
  description: `Submits a suggestion directly to the bot's Discord server. Be sure to make it as descriptive as possible.`,
  usage: 'botsuggestion `suggestion`',
  async execute(message, args, prefix) {
    const author = message.author.tag;
    const suggestion = '```' + args.join(' ') + '```';
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}botsuggestion [suggestion]. Please make it as descriptive as possible.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await message.client.channels.cache.get(suggestionChId).send(`__Suggestion by ${author}__\n\n${suggestion}`);
    message.react(reactionSuccess);
    message.channel.send(`Your suggestion has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: ${discordInviteLink}`);
  }
}