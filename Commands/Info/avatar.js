const Discord = require('discord.js');
const { deletionTimeout } = require('../../config.json');

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(user(s))`',
  execute(message, args) {
    if (!message.mentions.members.first()) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
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
            .setColor('#00ffbb')
            .setTimestamp()
            .setTitle(`${member.user.username}'s avatar`)
            .setImage(member.user.displayAvatarURL({ dynamic: true }));
          message.channel.send(avatarEmbed);
        }
      });
    }
  }
}