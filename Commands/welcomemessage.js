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
    usage: 'welcomemessage [message]',
    guildOnly: true,
    async execute(message,args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let msg = [];
        for (let i = 0; i < args.length; i++)
            msg = msg + args[i] + ' ';
        if(!args[0])
            message.channel.send(`Proper command usage: ${prefix}welcomemessage [message]. Use [user] to be replaced with a username.`);
        else
            if (!message.member.hasPermission('MANAGE_GUILD'))
                message.channel.send('You require the Manage Server permission in order to run this command.');
            else {
                let welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
                let welcomechannel = await message.guild.channels.cache.find(ch => ch.name === `${welcomechname}`);
                if (!welcomechannel)
                    message.channel.send(`You need to set a channel for welcome messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
                else {
                    await welcomemessages.set(`welcomemessage_${message.guild.id}`, msg);
                    await togglewelcomemsg.set(`togglewelcomemsg_${message.guild.id}`, 1);
                    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
                    let log = await message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
                    if (!log)
                        message.channel.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
                    else
                        log.send(`Welcome message successfully changed to ${'`' + msg + '`'}`);
                }
            }
    }
}