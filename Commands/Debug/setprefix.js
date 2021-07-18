const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'setprefix',
  description: 'Changes the default `/` prefix to a custom one.',
  usage: 'setprefix `prefix`',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setprefix [prefix]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You need the Manage Server permission in order to run this command.');
      msg.delete({ timeout: deletionTimeout })
      return message.react(reactionError);
    }

    await prefixes.set(message.guild.id, args[0]);
    await sendLog(message.guild, message.channel, `Server prefix successfully changed to ${args[0]}.`);
    message.react(reactionSuccess);
  }
}