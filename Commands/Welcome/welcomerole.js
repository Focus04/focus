const Keyv = require('keyv');
const welcomeRoles = new Keyv(process.env.welcomeRoles);
const logChannels = new Keyv(process.env.logChannels);

module.exports = {
  name: 'welcomerole',
  description: `Sets a role to be assigned to new users when they join the server.`,
  usage: 'welcomerole `role`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('I need the Manage Roles permission in order to execute this command!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}welcomerole [role]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const welcomeRoleName = args.join(' ').toLowerCase();
    const welcomeRole = message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(welcomeRoleName));
    let botHighestRole = -1;
    let highestRole = -1;

    if (!welcomeRole) {
      let msg = await message.channel.send(`Couldn't find any roles named "${rolename}"`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }
    
    message.guild.me.roles.cache.map((r) => {
      if (r.position > botHighestRole) botHighestRole = r.position;
    });

    if (welcomeR.position >= botHighestRole) {
      let msg = await message.channel.send('My roles must be higher than the role that you want to set.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }
    
    message.member.roles.cache.map((r) => {
      if (r.position > highestRole) highestRole = r.position;
    });

    if (welcomeRole.position >= highestRole) {
      let msg = await message.channel.send('Your roles must be higher than the role that you want to set.');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (!message.member.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('You lack permissions to run this command!');
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    await welcomeRoles.set(`welcomerole_${message.guild.id}`, rolename);
    let logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    let log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (!log) message.channel.send(`Welcome role successfully changed to ${'`' + welcomeRole.name + '`'}`);
    else log.send(`Welcome role successfully changed to ${'`' + welcomeRole.name + '`'}`);
    message.react('✔️');
  }
}