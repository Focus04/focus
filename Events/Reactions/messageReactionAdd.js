const Keyv = require('keyv');
const rolepickers = new Keyv(process.env.rolepickers);

module.exports = async (client, reaction, user) => {
    let rolepicker = await rolepickers.get(reaction.message.id);
    if(rolepicker) {
        if(reaction.message.partial)
            await reaction.message.fetch();
        if(rolepicker.hasOwnProperty(reaction.emoji)) {
            let role = reaction.message.guild.roles.cache.get(rolepicker.(reaction.emoji));
            let member = reaction.message.guild.members.cache.get(user.id);
            if(member && role) {
                member.roles.add(role);
                user.send(`Given you the role ${'`' + role.name + '`'}`);
            }
        }
    }
};