const Discord = require('discord.js');
const Keyv = require('keyv');
const database = require('../database.json');
const prefixes = new Keyv(database.prefixes);
const welcomedms = new Keyv(database.welcomedms);
const togglewelcomedm = new Keyv(database.togglewelcomedm);
module.exports = {
    name: 'togglewelcomedm',
    description: `Toggles welcome DMs on/off.`,
    usage: 'togglewelcomedm',
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
            let welcomedm = await welcomedms.get(`welcomedm_${message.guild.id}`);
            if (!welcomedm) {
                message.channel.send(`You first need to set a welcome DM. Use ${prefix}welcomedm to setup one.`);
                message.react('❌');
            }
            else {
                let logs = await togglewelcomedm.get(`togglewelcomedm_${message.guild.id}`);
                let state;
                if (!logs || logs == 0) {
                    logs = 1;
                    state = 'on';
                }
                else {
                    logs = 0;
                    state = 'off';
                }
                await togglewelcomedm.set(`togglewelcomedm_${message.guild.id}`, logs);
                message.channel.send(`Welcome DMs are now set to ${state}.`);
            }
        }

    }
}