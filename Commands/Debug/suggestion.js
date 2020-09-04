module.exports = {
    name: 'bugreport',
    description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
    usage: 'suggestion `suggestion`',
    guildOnly: true,
    async execute(message, args, prefix) {
        let author = message.author.tag;
        let suggestion = '```' + args.join(' ') + '```';
        if (!args[0]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}suggestion [suggestion]. Please make it as descriptive as possible.`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        message.client.channels.cache.get('751455845270814721').send(`__Suggestion by ${author}__\n\n${suggestion}`);
        message.react('✔️');
        message.channel.send(`Your suggestion has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: https://discord.gg/YvN7jUD`);
    }
}