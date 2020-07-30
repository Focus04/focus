const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
module.exports = {
    name: 'bugreport',
    description: `Submits a bug report directly to the bot's Discord server. Make sure that you include all the steps needed to reproduce the bug.`,
    usage: 'bugreport `bug`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let author = message.author.username;
        let bug;
        for (let i = 0; i < args.length; i++)
            bug = bug + ' ' + args[i];
        if (!bug)
            message.channel.send(`Proper command usage: ${prefix}bugreport [bug]. Make sure that you include all the steps needed to reproduce the bug.`);
        else {
            message.client.channels.cache.get('725434669453279352').send(`__Bug reported by ${author}__\n \n${bug}`);
            message.channel.send(`Your bug has been successfully submitted to our server and is now awaiting a review from the developer's side. You can join our Discord server anytime using this link: https://discord.gg/YvN7jUD`);
        }
    }
}