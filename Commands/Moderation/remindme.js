const { reactionError, reactionSuccess, deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'remindme',
  description: 'Sets a timer for a reminder.',
  usage: 'remindme `days` `text`',
  async execute (message, args, prefix) {
    if (!args[1] || isNaN(args[0])) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}remindme [days] [text]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const days = args[0];
    args.shift();
    message.channel.send(`Reminder successfully set for ${days} days from now.`);
    message.react(reactionSuccess);
    setTimeout(() => message.author.send(`⏰ Time to ${'`' + args.join(' ') + '`'}`), days * 86400000);
  }
}