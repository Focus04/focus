const Discord = require('discord.js');
const Keyv = require('keyv');
const logchannels = new Keyv(process.env.logchannels);
const msglogs = new Keyv(process.env.msglogs);

module.exports = async (client, oldmsg, newmsg) => {
    let logchname = await logchannels.get(`logchannel_${oldmsg.guild.id}`);
    let log = oldmsg.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = await msglogs.get(`msglogs_${oldmsg.guild.id}`);
    if (log && msglog == 1 && !oldmsg.author.bot) {
        let editembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${oldmsg.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Message Edited`)
            .addFields(
                { name: 'Author:', value: `${oldmsg.author.username}` },
                { name: 'Channel:', value: `${oldmsg.channel.name}` },
                { name: 'Initial Content:', value: `${oldmsg.content}` },
                { name: 'New Content:', value: `${newmsg.content}` }
            )
            .setTimestamp();
        log.send(editembed);
    }
}