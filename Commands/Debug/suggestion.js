import { deletionTimeout, reactionError, reactionSuccess, suggestionChId, discordInviteLink } from '../../config.json';

module.exports = {
  name: 'suggestion',
  description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
  usage: 'suggestion `suggestion`',
  async execute(message, args, prefix) {
    const author = message.author.tag;
    const suggestion = '```' + args.join(' ') + '```';
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}suggestion [suggestion]. Please make it as descriptive as possible.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await message.client.channels.cache.get(suggestionChId).send(`__Suggestion by ${author}__\n\n${suggestion}`);
    message.react(reactionSuccess);
    message.channel.send(`Your suggestion has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: ${discordInviteLink}`);
  }
}