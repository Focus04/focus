const Discord = require('discord.js');
const { deletionTimeout } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(user(s))`',
  execute(message, args) {
    let color = getRoleColor(message.guild);
    if (!message.mentions.members.first()) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle('Your avatar')
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(avatarEmbed);
    } else {
      message.mentions.members.forEach(async (member) => {
        let err = 0;
        if (!member) {
          err = 1;
          let msg = await message.channel.send(`Couldn't find ${member}`);
          return msg.delete({ timeout: deletionTimeout });
        }
        if (err == 0) {
          const avatarEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setTimestamp()
            .setTitle(`${member.user.username}'s avatar`)
            .setImage(member.user.displayAvatarURL({ dynamic: true }));
          message.channel.send(avatarEmbed);
        }
      });
    }
  }
}