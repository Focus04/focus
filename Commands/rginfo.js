const Discord = require('discord.js');
const moment = require('moment');
const fetch = require('node-fetch');
module.exports = {
    name: 'rginfo',
    description: `Tells you information about your favourite SA-MP community!.`,
    usage: 'rginfo',
    guildOnly: true,
    async execute(message, args) {
        let datainfo = await fetch('http://monitor.sacnr.com/api/?IP=91.134.166.78&Port=1337&Action=info&Format=JSON')
            .then(response => response.json());
        let dataplayers = await fetch('http://monitor.sacnr.com/api/?IP=91.134.166.78&Port=1337&Action=players&Format=JSON')
            .then(response => response.json());
        let hosted;
        if(datainfo.HostedTab == 1)
            hosted = 'Yes';
        else if(datainfo.HostedTab == 0)
            hosted = 'No';
        let rgembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${datainfo.Hostname}`)
            .setDescription(`${datainfo.Gamemode}`)
            .addFields(
                { name: 'Server ID', value: `${datainfo.ServerID}`},
                { name: 'Server IP', value: `${datainfo.IP}:${datainfo.Port}`},
                { name: 'Language', value: `${datainfo.Language}`},
                { name: 'Last Updated', value: `${moment(datainfo.LastUpdate).format('LT')} ${moment(datainfo.LastUpdate).format('LL')} (${moment(datainfo.LastUpdate).fromNow()})`},
                { name: 'Version', value: `${datainfo.Version}`},
                { name: 'Forums', value: `${datainfo.WebURL}`},
                { name: 'Hosted Tab', value: `${hosted}`},
                { name: 'Map', value: `${datainfo.Map}`},
                { name: 'Time', value: `${datainfo.Time}`},
                { name: 'Players', value: `${datainfo.Players}/${datainfo.MaxPlayers} (Average: ${datainfo.AvgPlayers})`},
                { name: `\u200B`, value: `${'```' + players + '```'}`}
            )
            .setThumbnail('https://i.imgur.com/GWRrz6m.png')
            .setTimestamp();
        message.channel.send(rgembed);
    }
}