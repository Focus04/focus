const { discordInviteLink } = require('../../config.json');

module.exports = {
  name: 'discordserver',
  description: `Sends an invite link to the bot's support server.`,
  usage: 'discordserver',
  guildOnly: true,
  execute(message) {
    message.channel.send(discordInviteLink);
  }
}