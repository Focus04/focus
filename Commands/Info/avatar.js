const Discord = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(user(s))`',
  execute(message, args) {
    if (!message.mentions.members) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('Your avatar')
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(avatarEmbed);
    } else {
      message.mentions.members.forEach((member) => {
        const avatarEmbed = new Discord.MessageEmbed()
          .setColor('#00ffbb')
          .setTimestamp()
          .setTitle(`${member.user.username}'s avatar`)
          .setImage(member.user.displayAvatarURL({ dynamic: true }));
        message.channel.send(avatarEmbed);
      });
    }
  }
}