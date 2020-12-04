const Keyv = require('keyv');
const reminders = new Keyv(process.env.reminders);
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
    let Reminder = {};
    Reminder.user = message.author;
    Reminder.text = '`' + args.join(' ') + '`';
    Reminder.date = Date.now() + days * 86400000;
    let remindersArr = await reminders.get(message.guild.id);
    if (!remindersArr) remindersArr = [];
    remindersArr.push(Reminder);
    await reminders.set(message.guild.id, remindersArr);
    message.channel.send(`Reminder successfully set for ${days} days from now.`);
    message.react(reactionSuccess);
  }
}