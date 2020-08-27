const Keyv = require('keyv');
const welcomechannels = new Keyv(process.env.welcomechannels);
const togglewelcome = new Keyv(process.env.togglewelcome);

module.exports = {
    name: 'togglewelcomemsg',
    description: `Toggles welcome messages on/off.`,
    usage: 'togglewelcomemsg',
    guildOnly: true,
    async execute(message, prefix) {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.channel.send('You require the Manage Server permission in order to run this command.');
            return message.react('❌');
        }
        let welcomechname = await welcomechannels.get(`welcomechannel_${message.guild.id}`);
        let welcome = message.guild.channels.cache.find(ch => ch.name === `${welcomechname}`);
        if (!welcome) {
            message.channel.send(`You first need to set a channel for messages to be sent in. Use ${prefix}setwelcomechannel to setup one.`);
            return message.react('❌');
        }
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
        message.react('✔️');
        message.channel.send(`Welcome messages are now set to ${state}.`);
    }
}