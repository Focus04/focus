const Keyv = require('keyv');
const rolePickers = new Keyv(process.env.rolePickers);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'delrolepicker',
  description: 'Deletes an existent role picker.',
  usage: 'delrolepicker `messageID`',
  requiredPerms: 'MANAGE_GUILD',
  permError: 'You require the Manage Server permission in order to run this command!',
  async execute(message, args, prefix) {
    let error;
    let menu = await message.channel.messages.fetch(args[0]).catch((err) => error = err);
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}delrolepicker [messageID]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (error) {
      let msg = await message.channel.send(`Couldn't find any rolePickers with the ID of ${args[0]}.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    await message.channel.messages.delete(menu);
    await rolePickers.delete(args[0]);
    message.channel.send(`Successfully deleted a role picker.`);
    message.react(reactionSuccess);
  }
}