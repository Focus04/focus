module.exports = async (client, channel) => {
  if (channel.type !== 'GUILD_TEXT') return;
  const mutedRole = await channel.guild.roles.cache.find((role) => role.name === 'Muted Member');
  if (!mutedRole) return;
  channel.permissionOverwrites.edit(mutedRole, {
    'SEND_MESSAGES': false,
    'ADD_REACTIONS': false,
    'SPEAK': false 
  });
}