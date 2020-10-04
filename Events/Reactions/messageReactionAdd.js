const Keyv = require('keyv');
const rolePickers = new Keyv(process.env.rolePickers);

module.exports = async (client, reaction, user) => {
  const rolePicker = await rolePickers.get(reaction.message.id);
  if (rolePicker) {
    if (reaction.message.partial) await reaction.message.fetch();
      
    if (rolePicker.hasOwnProperty(reaction.emoji.id || reaction.emoji)) {
      const role = reaction.message.guild.roles.cache.get(rolepicker[reaction.emoji.id || reaction.emoji]);
      const member = reaction.message.guild.members.cache.get(user.id);
      if (member && role && !user.bot) {
        member.roles.add(role);
        user.send(`Given you the role ${'`' + role.name + '`'}`);
      }
    }
  }
};