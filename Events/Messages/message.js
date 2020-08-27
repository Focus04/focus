const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);

module.exports = async (client, client, message) => {
    let prefix = "/";
    let customprefix = await prefixes.get(`${message.guild.id}`);
    if (customprefix)
        prefix = customprefix;
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = client.commands.get(args.shift().toLowerCase());
    if (!command)
        return;
    if (command.guildOnly && message.channel.type !== 'text')
        return message.reply('Nice attempt to slide into my DMs but no thanks! ;)');
    command.execute(message, args, prefix);
}