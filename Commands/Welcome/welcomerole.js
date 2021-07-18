const Keyv = require('keyv');
const welcomeRoles = new Keyv(process.env.welcomeRoles);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'welcomerole',
  description: `Sets a role to be assigned to new users when they join the server.`,
  usage: 'welcomerole `role`',
  requiredPerms: ['MANAGE_ROLES', 'MANAGE_GUILD'],
  botRequiredPerms: ['MANAGE_ROLES'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomerole [role]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const welcomeRoleName = args.join(' ').toLowerCase();
    const welcomeRole = message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(welcomeRoleName));
    let botHighestRole = -1;
    let highestRole = -1;

    if (!welcomeRole) {
      let msg = await message.channel.send(`Couldn't find any roles named "${rolename}"`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    message.guild.me.roles.cache.map((r) => {
      if (r.position > botHighestRole) botHighestRole = r.position;
    });

    if (welcomeRole.position >= botHighestRole) {
      let msg = await message.channel.send('My roles must be higher than the role that you want to set.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    message.member.roles.cache.map((r) => {
      if (r.position > highestRole) highestRole = r.position;
    });

    if (welcomeRole.position >= highestRole) {
      let msg = await message.channel.send('Your roles must be higher than the role that you want to set.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await welcomeRoles.set(`welcomerole_${message.guild.id}`, welcomeRole.name);
    await sendLog(message.guild, message.channel, `Welcome role successfully changed to ${'`' + welcomeRole.name + '`'}`);
    message.react(reactionSuccess);
  }
}