const Keyv = require('keyv')
const rolepickers = new Keyv(process.env.rolepickers)

module.exports = async (client, reaction, user) => {
  let rolepicker = await rolepickers.get(reaction.message.id)
  if (rolepicker) {
    if (reaction.message.partial) await reaction.message.fetch()
    if (rolepicker.hasOwnProperty(reaction.emoji.id || reaction.emoji)) {
      let member = reaction.message.guild.members.cache.get(user.id)
      let role = member.roles.cache.get(
        rolepicker[reaction.emoji.id || reaction.emoji]
      )
      if (member && role && !user.bot) {
        member.roles.remove(role)
        user.send(`Removed the role ${'`' + role.name + '`'}`)
      }
    }
  }
}
