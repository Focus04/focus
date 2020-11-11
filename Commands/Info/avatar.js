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
      let err = 0;
      let i = 0;
      args.forEach(async (arg) => {
        arg = message.guild.members.cache.find((member) => member.user.username === arg || member.nickname === arg);
        if(!arg) {
          let msg = await message.channel.send(`Couldn't find ${args[1]}`);
          msg.delete({ timeout: deletionTimeout });
          err = 1;
        }
        i++;
      });
      if(err == 1) return message.react(reactionError);
      args.forEach(async (member) => {
        const avatarEmbed = new Discord.MessageEmbed()
          .setColor('#00ffbb')
          .setTimestamp()
          .setTitle(`${member.user.username}'s avatar`)
          .setImage(member.user.displayAvatarURL({ dynamic: true }));
        await message.channel.send(avatarEmbed);
        message.react(reactionSuccess);
      });
    }
  }
}