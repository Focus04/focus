const Discord = require('discord.js');
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json')

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(user(s))`',
  async execute(message, args) {
    if (!args[0]) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('Your avatar')
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      await message.channel.send(avatarEmbed);
      message.react(reactionSuccess);
    } else {
      const member = message.guild.members.cache.find((m) => m.user.username === args[0] || m.nickname === args[0]) || message.mentions.members.first();
      if(!member) {
        let msg = await message.channel.send(`Couldn't find ${args[0]}`);
        msg.delete({ timeout: deletionTimeout });
        return message.react(reactionError);
      }
      
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTimestamp()
        .setTitle(`${member.user.username}'s avatar`)
        .setImage(member.user.displayAvatarURL({ dynamic: true }));
      await message.channel.send(avatarEmbed);
      message.react(reactionSuccess);
    }
  }
}