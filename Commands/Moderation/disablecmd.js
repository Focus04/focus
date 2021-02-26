const { Message } = require('discord.js');
const fs = require('fs');
const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.disabledcmds);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'disablecmd',
  description: 'Disables a command from the server.',
  usage: 'disablecmd `command`',
  requriedPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}disablecmd [command]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let commands = [];
    fs.readdirSync('./Commands').forEach((folder) => {
      fs.readdirSync(`./Commands/${folder}`).forEach((file) => commands.push(file.slice(0, lastIndexOf('.'))));
    });
    if (!commands.includes(args[0])) {
      let msg = await message.channel.send(`${'`' + args[0] + '`'} is not a valid command.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let disabledCommands = await disabledcmds.get(message.guild.id);
    if (!disabledCommands) disabledCommands = [];
    disabledCommands.push(args[0]);
    await disabledcmds.set(message.guild.id, disabledCommands);
    await message.channel.send(`${'`' + args[0] + '`'} has been disabled.`);
    message.react(reactionSuccess);
  }
}