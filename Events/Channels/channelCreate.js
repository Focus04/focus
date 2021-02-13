module.exports = async (client, channel) => {
  if (channel.type !== 'text') return;
  const mutedRole = channel.guild.roles.cache.find((role) => role.name === 'Muted Member');
  channel.updateOverwrites(mutedRole, {
    'SEND_MESSAGES': false,
    'ADD_REACTIONS': false,
    'SPEAK': false
  });
}