const Keyv = require('keyv')
const prefixes = new Keyv(process.env.prefixes)

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type !== 'text') return
  let prefix = (await prefixes.get(`${message.guild.id}`)) || '/'
  if (!message.content.startsWith(prefix)) return
  const args = message.content.slice(prefix.length).split(/ +/)
  const command = client.commands.get(args.shift().toLowerCase())
  if (!command) return
  command.execute(message, args, prefix)
}
