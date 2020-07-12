const Discord = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');
module.exports = {
    name: 'elginfo',
    description: `Tells you information about your favourite SA-MP community!.`,
    usage: 'elginfo',
    guildOnly: true,
    async execute(message, args) {
        let data = await fetch('https://monitor.teamshrimp.com/api/fetch/all/87.98.132.123/7777/')
            .then(response => response.json());
        let online;
        if (!data.online)
            return message.channel.send('eLg down your lives down.')
        let players = '```';
        data.players.map(player => {
            players = players + `${player.name}(${player.id}) - ${player.score} - ${player.ping}` + `\n`;
        })
        if (players === '```')
            players = '```None```';
        else
            players = players + '```';
        let rgembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${data.servername}`)
            .setDescription(`${data.gametype}`)
            .addFields(
                { name: 'Server IP', value: `${data.ip}:${data.port}`, inline: true },
                { name: 'Map', value: `${data.mapname}`, inline: true },
                { name: 'Time', value: `${data.worldtime}`, inline: true },
                { name: 'Forums', value: `http://elgclan.net`, inline: true },
                { name: 'Version', value: `${data.version}`, inline: true },
                { name: 'Players', value: `${data.num_players}/${data.max_players}`, inline: true },
                { name: 'Name(ID) - Score - Ping', value: `${players}` }
            )
            .setThumbnail('https://images-ext-2.discordapp.net/external/ZrjnUB1D5Q3JPTXvkGZZMnE4NsnOj-PWDrdA9F7brUY/%3Fsize%3D128/https/cdn.discordapp.com/icons/729315570054594632/9c956d6a7384fb330c24d2fffca34eb3.png')
            .setTimestamp();
        message.channel.send(rgembed);
    }
}