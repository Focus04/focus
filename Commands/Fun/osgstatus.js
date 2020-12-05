const Discord = require('discord.js');
const fetch = require('node-fetch');
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'osgstatus',
  description: `Tells you live information about your favourite SA-MP community!`,
  usage: 'osgstatus',
  guildOnly: true,
  async execute(message) {
    if (message.guild.id !== '783743580119236709') return;
    const response = await fetch('https://monitor.teamshrimp.com/api/fetch/all/178.63.13.143/16705/')
    const data = await response.json();
    if (!data.online) {
      let msg = await message.channel.send('Server down your lives down.');
      msg.delete({timeout: deletionTimeout });
      return message.react(reactionSuccess);
    }

    let players = '```';
    data.players.map(player => {
      players = players + `${player.name}(${player.id}) - ${player.score} - ${player.ping}` + `\n`;
    });
    if (players === '```') players = '```None```';
    else players = players + '```';
    let rgembed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${data.servername}`)
      .addFields(
        { name: 'Server IP', value: `${data.ip}:${data.port}`, inline: true },
        { name: 'Map', value: `${data.mapname}`, inline: true },
        { name: 'Time', value: `${data.worldtime}`, inline: true },
        { name: 'Forums', value: 'https://osgclan.net/', inline: true },
        { name: 'Version', value: `${data.version}`, inline: true },
        { name: 'Players', value: `${data.num_players}/${data.max_players}`, inline: true },
        { name: 'Name(ID) - Score - Ping', value: `${players}` }
      )
      .setThumbnail('https://images-ext-1.discordapp.net/external/rzBGphe1bc-RWrbHzLQdbeSigBFw40lwLJS3PoppyCU/%3Fsize%3D1024/https/cdn.discordapp.com/icons/783743580119236709/29b4b6388600e4843c7bb52e721bec03.webp?width=475&height=475')
      .setTimestamp();
    await message.channel.send(rgembed);
    message.react(reactionSuccess);
  }
}