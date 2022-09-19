const Keyv = require('keyv');
const punishments = new Keyv(process.env.DB_URI.replace('dbname', 'punishments'));

module.exports = async (client, guild) => {
  const guilds = await punishments.get('guilds');
  if (!guilds.includes(guild.id)) return;
  guilds.splice(guilds.indexOf(guild.id), 1);
  await punishments.set(guilds, 'guilds');
}