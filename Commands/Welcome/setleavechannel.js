const Keyv = require('keyv');
const leavechannels = new Keyv(process.env.leavechannels);

module.exports = {
    name: 'setleavechannel',
    description: `Sets a custom channel where leaving members will be logged.`,
    usage: 'setleavechannel `channel-name`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}setleavechannel [channel-name]`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            let msg = await message.channel.send('You require the Manage Server permission in order to run this command.');
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let channel = message.guild.channels.cache.find(ch => ch.name === `${args[0]}`);
        if (!channel) {
            let msg = await message.channel.send(`Couldn't find ${args[0]}. Please make sure that I have access to that channel.`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        await leavechannels.set(`leavechannel_${message.guild.id}`, args[0]);
        message.react('✔️');
        message.channel.send(`All leaving members will be logged in ${args[0]} from now on.`);
    }
}