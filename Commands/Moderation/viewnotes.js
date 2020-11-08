const Discord =require('discord.js');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'viewnotes',
  description: `Views all notes linked to an account.`,
  usage: 'viewnotes `username`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}viewnotes [username]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const member = message.guild.members.cache.find((user) => user.user.username === `${args[0]}` || user.nickname === `${args[0]}`) || message.mentions.members.first();
    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    let content = '';
    notes.forEach((note) => content += note);
    await message.channel.send('Check your inbox.');
    if (!notes[0]) message.author.send(`There are no notes linked to ${member.username}.`);
    else {
      const viewNotesEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle(`${member.user.username}'s notes`)
        .setDescription(content)
        .setTimestamp();
      message.author.send(viewNotesEmbed);
    }
    message.react(reactionSuccess);
  }
}