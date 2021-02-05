const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'botinfo',
  description: `Checks how many servers the bot is in.`,
  usage: 'botinfo',
  async execute(message, args, prefix) {
    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    let membercount = 0;
    message.client.guilds.cache.forEach((guild) => membercount += guild.members.cache.size)
    const infoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle('Bot info')
      .addFields(
        { name: 'Server Count', value: message.client.guilds.cache.size },
        { name: 'User Count', value: membercount }
      )
      .setTimestamp();
    message.channel.send(infoEmbed);
  }
}