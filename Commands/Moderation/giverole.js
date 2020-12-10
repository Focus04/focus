const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'giverole',
  description: `Adds a role to a user.`,
  usage: 'giverole @`member` `role`',
  requiredPerms: 'MANAGE_ROLES',
  permError: 'You require the Manage Roles permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    let botHighestRole = -1;
    let highestRole = -1;
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('I need the Manage Roles permission in order to execute this command.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}giverole @[member] [role]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!member) {
      let msg = await message.channel.send(`Couldn't find ${args[0]}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    args.shift();
    const roleName = args.join(' ').toLowerCase();
    const role = message.guild.roles.cache.find((role) => role.name.toLowerCase().startsWith(roleName));

    if (!role) {
      let msg = await message.channel.send(`Couldn't find any roles named ${roleName}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (member.roles.cache.has(role.id)) {
      let msg = await message.channel.send(`${member.user.username} already has that role.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    message.guild.me.roles.cache.map((r) => {
      if (r.position > botHighestRole) botHighestRole = r.position;
    });
    if (role.position >= botHighestRole) {
      let msg = await message.channel.send('My roles must be higher than the role that you want to give!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    message.member.roles.cache.map((r) => {
      if (r.position > highestRole) highestRole = r.position;
    });
    if (role.position >= highestRole) {
      let msg = await message.channel.send('Your roles must be higher than the role that you want to give!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    member.roles.add(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    const giveRoleEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Given Role`)
      .addFields(
        { name: 'To', value: `${member}` },
        { name: 'By', value: `${message.author.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
      )
      .setTimestamp();
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (log) log.send(giveRoleEmbed);
    else message.channel.send(giveRoleEmbed);
    message.react(reactionSuccess);
  }
}