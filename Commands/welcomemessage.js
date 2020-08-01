const Discord = require('discord.js');
const client = new Discord.Client();
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const welcomechannels = new Keyv(database.welcomechannels);
const welcomemessages = new Keyv(database.welcomemessages);
const togglewelcomemsg = new Keyv(database.togglewelcomememsg);
const logchannels = new Keyv(database.logchannels);
module.exports = {
    name: 'welcomemessage',
    description: `Sets a custom welcome message to be displayed when someone joins the server.`,
    usage: 'welcomemessage',
    guildOnly: true,
    async execute(message) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!message.member.hasPermission('MANAGE_GUILD'))
            message.channel.send('You require the Manage Server permission in order to run this command.');
        else {
            let welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
            let welcomechannel = await message.guild.channels.cache.find(ch => ch.name === `${welcomechname}`);
            if (!welcomechannel)
                message.channel.send(`You need to set a channel for welcome messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
            else {
                await message.channel.send('Input a message. `[user]` will be replaced with a username.');
                client.on('message', async msg => {
                    if (msg.author.id == message.author.id) {
                        await welcomemessages.set(`welcomemessage_${msg.guild.id}`, msg.content);
                        await togglewelcomemsg.set(`togglewelcomemsg_${msg.guild.id}`, 1);
                        let logchname = await logchannels.get(`logchannel_${msg.guild.id}`);
                        let log = await msg.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                        let welcomemsg = '`' + msg.content + '`';
                        if (!log)
                            msg.channel.send(`Welcome message successfully changed to ${welcomemsg}`);
                        else
                            log.send(`Welcome message successfully changed to ${welcomemsg}`);
                    }
                })
            }
        }
    }
}