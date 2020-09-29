const moment = require('moment');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);

module.exports = {
  name: 'addnote',
  description: `Adds an admin note on someone's account. All staff members will be able to view this note.`,
  usage: 'addnote `username` `note`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}addnote [username] [note]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const member = message.guild.members.cache.find((user) => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`) || message.mentions.members.first();
    
    if (!member) {
      await message.author.send(`Couldn't find ${args[0]}.`);
      return message.delete();
    }

    if (!message.member.hasPermission('KICK_MEMBERS')) {
      let msg = await message.channel.send('You need the Kick Members permission in order to run this command.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    args.shift();
    const note = '```' + args.join(' ') + '```';
    let notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    if (!notes) notes = note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    else notes = notes + note + `Added by ${message.author.username} on ${moment(message.createdTimestamp).format('LL')}, at ${moment(message.createdTimestamp).format('LT')} GMT\n`;
    await nts.set(`notes_${member.id}_${message.guild.id}`, notes);
    await message.author.send(`Note successfully added on ${member.user.username}'s account`);
    message.delete();
  }
}