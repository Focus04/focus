const Discord = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');
module.exports = {
    name: 'rginfo',
    description: `Tells you information about your favourite SA-MP community!.`,
    usage: 'rginfo',
    guildOnly: true,
    async execute(message, args) {
        let data = await fetch('https://monitor.teamshrimp.com/api/fetch/all/91.134.166.78/1337/')
            .then(response => response.json());
        let online;
        if (data.online)
            online = 'Yes';
        else
            online = 'No';
        let players = '```';
        data.players.map(player => {
            players = players + `${player.name}(${player.id}) - ${player.score} - ${player.ping}` + `\n`;
        })
        players = players + '```';
        let rgembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${data.servername}`)
            .setDescription(`${data.gametype}`)
            .addFields(
                { name: 'Server IP', value: `${data.ip}:${data.port}`, inline: true },
                { name: 'Map', value: `${data.mapname}`, inline: true },
                { name: 'Forums', value: `http://rg-clan.com`, inline: true },
                { name: 'Online', value: `${online}`, inline: true },
                { name: 'Version', value: `${data.version}`, inline: true },
                { name: 'Players', value: `${data.num_players}/${data.max_players}`, inline: true },
                { name: 'Name(ID) - Score - Ping', value: `${players}` }
            )
            .setThumbnail('https://i.imgur.com/GWRrz6m.png')
            .setTimestamp();
        message.channel.send(rgembed);
    }
}