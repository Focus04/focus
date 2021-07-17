const Keyv = require('keyv');
const reminders = new Keyv(process.env.reminders);
const punishments = new Keyv(process.env.punishments);
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
    if (days <= 0) { 
      let msg = await message.channel.send('Days must be a positive number.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    args.shift();
    let Reminder = {};
    Reminder.userID = message.author.id;
    Reminder.text = '`' + args.join(' ') + '`';
    Reminder.date = Date.now() + days * millisecondsPerDay;
    Reminder.channel = message.channel.id;
    let remindersArr = await reminders.get(message.guild.id);
    let guilds = await punishments.get('guilds');
    if (!remindersArr) remindersArr = [];
    if (!guilds.includes(message.guild.id)) guilds.push(message.guild.id);
    remindersArr.push(Reminder);
    await reminders.set(message.guild.id, remindersArr);
    await punishments.set('guilds', guilds);
    message.channel.send(`Reminder successfully set for ${days} days from now.`);
    message.react(reactionSuccess);
  }
}