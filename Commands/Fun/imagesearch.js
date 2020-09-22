const Discord = require('discord.js')
const fetch = require('node-fetch')
const message = require('../../Events/Messages/message')
const { execute } = require('./catfact')

module.exports = {
  name: 'imagesearch',
  description: 'Looks up an image on the internet and outputs it in an embed.',
  usage: 'imagesearch `term`',
  guildOnly: true,
  async execute (message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(
        `Proper command usage: ${prefix} imagesearch [term]`
      )
      msg.delete({ timeout: 10000 })
      return message.react('❌')
    }
    let term = args.join(' ')
    let response = await fetch(
      `https://app.zenserp.com/api/v2/search?apikey=${process.env.imagesearch}&q=${term}&tbm=isch&device=desktop&location=Manhattan,New%20York,United%20States`
    )
    let data = await response.json()
    let imagesearchembed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(term)
      .setImage(data.image_results[0].sourceUrl)
      .setTimestamp()
    await message.channel.send(imagesearchembed)
    message.react('✔️')
  }
}
