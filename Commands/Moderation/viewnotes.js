const Discord =require('discord.js');
const Keyv = require('keyv');
const nts = new Keyv(process.env.notes);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'viewnotes',
  description: `Views all notes linked to an account.`,
  usage: 'viewnotes @`user`',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}viewnotes @[user]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    let member = {};
    if (isNaN(args[0])) member = message.mentions.members.first();
    else member = await message.guild.members.fetch(args[0]).catch(async (err) => {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      return message.delete({ timeout: deletionTimeout });
    });
    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      return message.delete({ timeout: deletionTimeout });
    }

    let content = '';
    const notes = await nts.get(`notes_${member.id}_${message.guild.id}`);
    if (notes) notes.forEach((note) => content += note);
    await message.channel.send('Check your inbox.');
    if (!notes[0]) message.author.send(`There are no notes linked to ${member.user.username}.`);
    else {
      let color;
      if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
      else color = message.guild.me.roles.highest.color;
      const viewNotesEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`${member.user.username}'s notes`)
        .setDescription(content)
        .setTimestamp();
      message.author.send(viewNotesEmbed);
    }
    message.react(reactionSuccess);
  }
}