const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);

module.exports = async (client, guild) => {
  client.user.setActivity('your people.', { type: 'WATCHING' });
  const prefix = await prefixes.get(guild.id);
  client.guildConfigs.set(guild.id, {
    prefix
  });
}