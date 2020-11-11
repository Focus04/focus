const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'delnote',
  description: 'Deletes a note from a user.',
  usage: 'delnote @`user` `noteID`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!args[1] || !member || isNaN(args[1])) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}delnote @[user] [noteID]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);

    if (parseInt(args[1]) > notes.length || parseInt(args[1]) < 1) {
      await message.author.send(`Couldn't find any notes with the ID of ${args[1]}`);
      return message.delete();
    }

    notes.splice(parseInt(args[1] - 1), 1);
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully deleted from ${member.user.username}'s account.`);
    message.delete();
  }
}