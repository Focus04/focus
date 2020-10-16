import { botInviteLink } from '../../config.json';

module.exports = {
  name: 'invitelink',
  description: 'Sends the invite link for the bot.',
  usage: 'invitelink',
  guildOnly: true,
  execute(message) {
    message.channel.send(botInviteLink);
  }
}