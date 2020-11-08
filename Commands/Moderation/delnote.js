const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'delnote',
  description: 'Deletes a note from a user.',
  usage: 'delnote `username` `noteID`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}delnote [username] [noteID]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    const member = message.guild.members.cache.find((user) => user.user.username === args[0] || user.nickname === args[0]) || message.mentions.members.first();

    if (!member) {
      await message.author.send(`Couldn't find ${args[0]}`);
      return message.delete();
    }

    const notes = await nts.get(`notes_${member.id}_${message.guild.id}`);

    if (parseInt(args[1]) > notes.length) {
      await message.author.send(`Couldn't find any notes with the ID of ${args[1]}`);
      return message.delete();
    }

    notes.splice(parseInt(args[1] - 1), 1);
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully deleted from ${member.user.username}'s account.`);
    message.delete();
  }
}