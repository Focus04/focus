const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const { deletionTimeout, reactionError, reactionSuccess, pinEmojiId } = require('../../config.json');

module.exports = {
  name: 'takerole',
  description: `Deletes a role from a user.`,
  usage: 'takerole @`member` `role`',
  requiredPerms: 'MANAGE_ROLES',
  permError: 'You require the Manage Roles permission in order to run this command.',
  async execute(message, args, prefix) {
    const member = message.mentions.members.first();
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) {
      let msg = await message.channel.send('I need the Manage Roles permission in order to execute this command.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    if (!args[1]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}takerole @[member] [role]`);
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
    const role = member.roles.cache.find((role) => role.name.toLowerCase().startsWith(roleName));
    if (!role) {
      let msg = await message.channel.send(`${member.user.username} doesn't have any roles named ${roleName}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError)
    }

    let botHighestRole = -1;
    let highestRole = -1;
    message.guild.me.roles.cache.map((r) => {
      if (r.position > botHighestRole) botHighestRole = r.position;
    });
    if (role.position >= botHighestRole) {
      let msg = await message.channel.send('My roles must be higher than the role that you want to take!');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    message.member.roles.cache.map((r) => {
      if (r.position > highestRole) highestRole = r.position;
    });
    if (role.position >= highestRole) {
      let msg = await message.channel.send('Your roles must be higher than the role that you want to take.');
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    member.roles.remove(role);
    let perms = role.permissions.toArray().map((perm) => perm).join(`\n`);
    perms = '```' + perms + '```';
    const takeRoleEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`${message.client.emojis.cache.get(pinEmojiId).toString()} Deleted Role`)
      .addFields(
        { name: 'From', value: `${member}` },
        { name: 'By', value: `${message.author.username}` },
        { name: 'Role', value: `${role.name}` },
        { name: 'Permissions', value: `${perms}` }
      )
      .setTimestamp();
    const logChName = await logChannels.get(`logchannel_${message.guild.id}`);
    const log = await message.guild.channels.cache.find((ch) => ch.name === `${logChName}`);
    if (log) log.send(takeRoleEmbed);
    else  message.channel.send(takeRoleEmbed);
    message.react(reactionSuccess);
  }
}