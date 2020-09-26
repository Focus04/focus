const Discord = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Displays the avatar(s) of certain users.',
  usage: 'avatar `(@user(s))`',
  guildOnly: true,
  execute(message) {
    if (!message.mentions.users.size) {
      const avatarembed = new Discord.MessageEmbed()
        .setColor('#00ffbb')
        .setTitle('Your avatar')
        .setImage(message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      message.channel.send(avatarembed);
    } else
      message.mentions.users.forEach(user => {
        const avatarembed2 = new Discord.MessageEmbed()
          .setColor('#00ffbb')
          .setTimestamp()
          .setTitle(`${user.username}'s avatar`)
          .setImage(user.displayAvatarURL({ dynamic: true }));
        message.channel.send(avatarembed2);
      });
  }
}