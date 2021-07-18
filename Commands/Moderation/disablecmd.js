const fs = require('fs');
const Keyv = require('keyv');
const disabledcmds = new Keyv(process.env.disabledcmds);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'disablecmd',
  description: 'Disables a command from the server.',
  usage: 'disablecmd `command`',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}disablecmd [command]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let commands = [];
    fs.readdirSync('./Commands').forEach((folder) => {
      fs.readdirSync(`./Commands/${folder}`).forEach((file) => commands.push(file.slice(0, file.lastIndexOf('.'))));
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
    await sendLog(message.guild, message.channel, `${'`' + args[0] + '`'} has been disabled.`);
    message.react(reactionSuccess);
  }
}