const Discord = require('discord.js');
const fetch = require('node-fetch');
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');

module.exports = {
  name: 'imagesearch',
  description: 'Looks up an image on the internet and outputs it in an embed.',
  usage: 'imagesearch `term`',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix} imagesearch [term]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const term = args.join(' ');
    const response = await fetch(`https://app.zenserp.com/api/v2/search?apikey=${process.env.imagesearch}&q=${term}&tbm=isch&device=desktop&location=Manhattan,New%20York,United%20States`);
    const data = await response.json();
    const imageSearchEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(term)
      .setImage(data.image_results[0].sourceUrl)
      .setTimestamp();
    await message.channel.send(imageSearchEmbed);
    message.react(reactionSuccess);
  }
}