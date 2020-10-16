import Keyv from 'keyv';
const rolePickers = new Keyv(process.env.rolePickers);

module.exports = async (client, reaction, user) => {
  const rolePicker = await rolePickers.get(reaction.message.id);
  if (rolePicker) {
    if (reaction.message.partial) await reaction.message.fetch();
      
    if (rolePicker.hasOwnProperty(reaction.emoji.id || reaction.emoji)) {
      const member = reaction.message.guild.members.cache.get(user.id);
      const role = member.roles.cache.get(rolePicker[reaction.emoji.id || reaction.emoji]);
      if (member && role && !user.bot) {
        member.roles.remove(role);
        user.send(`Removed the role ${'`' + role.name + '`'}`);
      }
    }
  }
};