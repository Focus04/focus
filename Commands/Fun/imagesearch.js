const Discord = require('discord.js');
const fetch = require('node-fetch');
const message = require('../../Events/Messages/message');
const { execute } = require('./catfact');

module.exports = {
    name: 'imagesearch',
    description: 'Looks up an image on the internet and outputs it in an embed.',
    usage: 'imagesearch `term`',
    guildOnly: true,
    async execute(message, args, prefix) {
        if (!args[0]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix} imagesearch [term]`);
            msg.delete({ timeout: 10000 });
            return message.react('❌');
        }
        let term = args.join(' ');
        let response = await fetch(`https://serpapi.com/playground?q=${term}&tbm=isch&ijn=0`);
        let data = await response.json();
        let imagesearchembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(term)
            .setImage(data.images_results[0].original)
            .setTimestamp();
        await message.channel.send(imagesearchembed);
        message.react('✔️');
    }
}