module.exports = {
    name: 'bugreport',
    description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
    usage: 'bugreport `bug`',
    guildOnly: true,
    execute(message, args, prefix) {
        let author = message.author.username;
        let bug = '```' + args.join(' ') + '```';
        if (!args[0]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}bugreport [bug]. Make sure that you include all the steps needed to reproduce the bug.`);
            msg.delete({timeout: 10000});
            return message.react('❌');
        }
        message.client.channels.cache.get('725434669453279352').send(`__Bug reported by ${author}__\n\n${bug}`);
        message.react('✔️');
        message.channel.send(`Your bug has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: https://discord.gg/YvN7jUD`);
    }
}