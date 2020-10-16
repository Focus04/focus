import Discord from 'discord.js';

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(@user(s))`',
  execute(message) {
    if (!message.mentions.users.size) {
      const avatarEmbed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('Your avatar')
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(avatarEmbed);
    } else
      message.mentions.users.forEach((user) => {
        const avatarEmbed = new Discord.MessageEmbed()
          .setColor('#00ffbb')
          .setTimestamp()
          .setTitle(`${user.username}'s avatar`)
          .setImage(user.displayAvatarURL({ dynamic: true }));
        message.channel.send(avatarEmbed);
      });
  }
}