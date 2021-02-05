const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'botsuggestion',
  description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
  usage: 'botsuggestion `suggestion`',
  async execute(message, args, prefix) {
    let color;
    if (message.guild.me.roles.highest.color === 0) color = '#b9bbbe';
    else color = message.guild.me.roles.highest.color;
    let membercount = 0;
    message.client.guilds.cache.forEach((guild) => membercount += guild.members.cache.length)
    const infoEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle('Bot info')
      .addFields(
        { name: 'Server Count', value: message.client.guilds.cache.length },
        { name: 'User Count', value: membercount }
      )
      .setTimestamp();
    message.channel.send(infoEmbed);
  }
}