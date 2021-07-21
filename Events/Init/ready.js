const { Collection } = require('discord.js');
const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const reminders = new Keyv(process.env.reminders);
const logChannels = new Keyv(process.env.logChannels);
const mutedMembers = new Keyv(process.env.mutedMembers);
const punishments = new Keyv(process.env.punishments);
const prefixes = new Keyv(process.env.prefixes);

module.exports = (client) => {
  console.log('I am live!');
  client.user.setActivity('your people.', { type: 'WATCHING' });
  client.guildConfigs = new Collection();
  client.guilds.cache.forEach(async (guild) => {
    const prefix = await prefixes.get(guild.id);
    const config = {
      prefix
    };
    client.guildConfigs.set(guild.id, config);
  });
  setInterval(async () => {
    const guilds = await punishments.get('guilds');
    if (!guilds) {
      await punishments.set('guilds', []);
      return;
    }
    guilds.forEach(async (guildID) => {
      const guild = await client.guilds.fetch(guildID);
      let bannedUsersArr = await bannedUsers.get(guild.id);
      const logChName = await logChannels.get(`logchannel_${guild.id}`);
      const log = guild.channels.cache.find((ch) => ch.name === `${logChName}`);
      if (bannedUsersArr && bannedUsersArr.length > 0) {
        bannedUsersArr.forEach((user) => {
          if (user.unbanDate && user.unbanDate <= Date.now()) {
            const banInfo = guild.fetchBan(user.userID);
            if (banInfo) {
              bannedUsersArr.splice(bannedUsersArr.indexOf(user), 1);
              guild.members.unban(user.userID);
              if (log) log.send(`${user.username} has been unbanned.`);
            }
          }
        });
        bannedUsers.set(guild.id, bannedUsersArr);
      }

      let remindersArr = await reminders.get(guild.id);
      if (remindersArr && remindersArr.length > 0) {
        remindersArr.forEach(async (reminder) => {
          if (reminder.date <= Date.now()) {
            const member = await guild.members.fetch(reminder.userID);
            remindersArr.splice(remindersArr.indexOf(reminder), 1);
            member.user.send(`⏰ Time to ${reminder.text}`).catch(async () => {
              const channel = await client.channels.fetch(reminder.channel);
              channel.send(`⏰ ${member}, time to ${reminder.text}`);
            });
          }
        });
        reminders.set(guild.id, remindersArr);
      }

      let mutedMembersArr = await mutedMembers.get(guild.id);
      if (mutedMembersArr && mutedMembersArr.length > 0) {
        mutedMembersArr.forEach(async (arrElement) => {
          if (arrElement.unmuteDate <= Date.now()) {
            const member = await guild.members.fetch(arrElement.userID);
            const mutedRole = guild.roles.cache.find((role) => role.name === 'Muted Member');
            if (member.roles.cache.has(mutedRole.id)) {
              member.roles.remove(mutedRole);
              if (log) log.send(`${member} has been unmuted.`);
              member.send(`You have been unmuted from ${guild.name}.`);
            }
            mutedMembersArr.splice(mutedMembersArr.indexOf(arrElement), 1);
          }
        });
        await mutedMembers.set(guild.id, mutedMembersArr);
      }
    });
  }, 60000);
}