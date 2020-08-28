const Keyv = require('keyv');
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.togglewelcomedm);

module.exports = {
    name: 'togglewelcomedm',
    description: `Toggles welcome DMs on/off.`,
    usage: 'togglewelcomedm',
    guildOnly: true,
    async execute(message, prefix) {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let welcomedm = await welcomedms.get(`welcomedm_${message.guild.id}`);
        if (!welcomedm) {
            let msg = await message.channel.send(`You first need to set a welcome DM. Use ${prefix}welcomedm to setup one.`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
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
        message.react('✔️');
        message.channel.send(`Welcome DMs are now set to ${state}.`);
    }
}