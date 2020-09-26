const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);

module.exports = {
  name: 'setprefix',
  description: 'Changes the default `/` prefix to a custom one.',
  usage: 'setprefix `prefix`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}setprefix [prefix]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send('You need the Manage Server permission in order to run this command.');
      msg.delete({ timeout: 10000 })
      return message.react('❌');
    }

    await prefixes.set(message.guild.id, args[0]);
    message.react('✔️');
    message.channel.send(`Server prefix successfully changed to ${args[0]}.`);
  }
}