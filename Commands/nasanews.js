const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'nasanews',
    description: `Looks up an astronomy-related term on NASA's Website and returns a fact about it.`,
    usage: 'nasanews `term`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            message.channel.send(`Proper command usage: ${prefix}nasanews [term]`);
            return message.react('❌');
        }
        let term = args.join(' ');
        let data = await fetch(`https://images-api.nasa.gov/search?q=${term}`)
            .then(res => res.json());
        if (!data.collection.items[0].data[0].description) {
            message.channel.send(`Couldn't find any results for ${term}`);
            return message.react('❌');
        }
        let nasasearchembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(data.collection.items[0].data[0].title)
            .setDescription(data.collection.items[0].data[0].description)
            .setImage(data.collection.items[0].links[0].href)
            .setTimestamp();
        message.react('✔️');
        message.channel.send(nasasearchembed);
    }
}