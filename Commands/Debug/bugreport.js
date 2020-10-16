import { deletionTimeout, reactionError, bugChId, reactionSuccess, discordInviteLink } from '../../config.json';

module.exports = {
  name: 'bugreport',
  description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
  usage: 'bugreport `bug`',
  async execute(message, args, prefix) {
    const author = message.author.tag;
    let bug = '```' + args.join(' ') + '```';
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}bugreport [bug]. Make sure that you include all the steps needed to reproduce the bug.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await message.client.channels.cache.get(bugChId).send(`__Bug reported by ${author}__\n\n${bug}`);
    message.react(reactionSuccess);
    message.channel.send(`Your bug has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: ${discordInviteLink}`);
  }
}