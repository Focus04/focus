const Discord = require('discord.js');
const fetch = require('node-fetch');
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'nasanews',
  description: `Looks up an astronomy-related term on NASA's Website and returns a fact about it.`,
  usage: 'nasanews `term`',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}nasanews [term]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const term = args.join(' ');
    const response = await fetch(`https://images-api.nasa.gov/search?q=${term}`);
    const data = await response.json();
    
    if (!data.collection.items[0].data[0].description) {
      let msg = await message.channel.send(`Couldn't find any results for ${term}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const nasaSearchEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(data.collection.items[0].data[0].title)
      .setDescription(data.collection.items[0].data[0].description)
      .setImage(data.collection.items[0].links[0].href.split(' ').join('%20'))
      .setTimestamp();
    await message.channel.send(nasaSearchEmbed);
    message.react(reactionSuccess);
  }
}