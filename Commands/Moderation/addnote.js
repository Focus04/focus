const moment = require('moment');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'addnote',
  description: `Adds an admin note on someone's account. All staff members will be able to view this note.`,
  usage: 'addnote @`user` `note`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}addnote @[user] [note]`);
      return msg.delete({ timeout: deletionTimeout });
    }

    const member = message.mentions.members.first();
    
    if (!member) {
      await message.author.send(`Couldn't find ${args[0]}.`);
      return message.delete();
    }

    args.shift();
    let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    if (!notes) notes = [];
    const note = '```' + `${args.join(' ')}` + '```' + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    notes.push(note);
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully added on ${member.user.username}'s account`);
    message.delete();
  }
}