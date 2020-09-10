const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'nasanews',
    description: `Looks up an astronomy-related term on NASA's Website and returns a fact about it.`,
    usage: 'nasanews `term`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            let msg  = await message.channel.send(`Proper command usage: ${prefix}nasanews [term]`);
            msg.delete({timeout: 10000});
            return message.react('❌');
        }
        let term = args.join(' ');
        let response = await fetch(`https://images-api.nasa.gov/search?q=${term}`);
        let data = await response.json();
        if (!data.collection.items[0].data[0].description) {
            let msg = await message.channel.send(`Couldn't find any results for ${term}`);
            msg.delete({timeout: 10000});
            return message.react('❌');
        }
        let nasasearchembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(data.collection.items[0].data[0].title)
            .setDescription(data.collection.items[0].data[0].description)
            .setImage(data.collection.items[0].links[0].href.replace(' ', '%20'))
            .setTimestamp();
        console.log(data.collection.items[0].links[0].href.replace(' ', '%20'));
        await message.channel.send(nasasearchembed);
        message.react('✔️');
    }
}