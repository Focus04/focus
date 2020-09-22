const Keyv = require('keyv')
const rolepickers = new Keyv(process.env.rolepickers)

module.exports = {
  name: 'delrolepicker',
  description: 'Deletes an existent role picker.',
  usage: 'delrolepicker `messageID`',
  guildOnly: true,
  async execute (message, args, prefix) {
    let error
    let menu = await message.channel.messages
      .fetch(args[0])
      .catch(err => (error = err))
    if (!args[0]) {
      let msg = await message.channel.send(
        `Proper command usage: ${prefix}delrolepicker [messageID]`
      )
      msg.delete({ timeout: 10000 })
      return message.react('❌')
    }
    if (error) {
      let msg = await message.channel.send(
        `Couldn't find any rolepickers with the ID of ${args[0]}.`
      )
      msg.delete({ timeout: 10000 })
      return message.react('❌')
    }
    if (!message.member.hasPermission('MANAGE_GUILD')) {
      let msg = await message.channel.send(
        'You require the Manage Server permission in order to run this command!'
      )
      msg.delete({ timeout: 10000 })
      return message.react('❌')
    }
    await message.channel.messages.delete(menu)
    await rolepickers.delete(args[0])
    message.channel.send(`Successfully deleted a role picker.`)
    message.react('✔️')
  }
}
