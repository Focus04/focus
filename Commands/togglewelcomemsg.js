const Discord = require('discord.js');
const Keyv = require('keyv');
const database = require('../database.json');
const prefixes = new Keyv(database.prefixes);
const welcomechannels = new Keyv(database.welcomechannels);
const togglewelcome = new Keyv(database.togglewelcomememsg);
module.exports = {
    name: 'togglewelcomemsg',
    description: `Toggles welcome messages on/off.`,
    usage: 'togglewelcomemsg',
    guildOnly: true,
    async execute(message) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            message.react('❌');
        }
        else {
            let welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
            let welcome = message.guild.channels.cache.find(ch => ch.name === `${welcomechname}`);
            if (!welcome) {
                message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
                message.react('❌');
            }
            else {
                let logs = await togglewelcome.get(`togglewelcomemsg_${message.guild.id}`);
                let state;
                if (!logs || logs == 0) {
                    logs = 1;
                    state = 'on';
                }
                else {
                    logs = 0;
                    state = 'off';
                }
                await togglewelcome.set(`togglewelcomemsg_${message.guild.id}`, logs);
                message.channel.send(`Welcome messages are now set to ${state}.`);
            }
        }

    }
}