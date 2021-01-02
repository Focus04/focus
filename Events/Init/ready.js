const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const reminders = new Keyv(process.env.reminders);
const logChannels = new Keyv(process.env.logChannels);
const mutedMembers = new Keyv(process.env.mutedMembers);
const punishments = new Keyv(process.env.punishments);

module.exports = (client) => {
  console.log('I am live!');
  client.user.setActivity('your people.', { type: 'WATCHING' });

  setInterval(async () => {
    const guilds = await punishments.get('guilds');
    guilds.forEach(async (guildID) => {
      console.log(`Found ${guildID}`);
      const guild = await client.guilds.fetch(guildID);
      console.log(`ID: ${guild.name}`);
      let bannedUsersArr = await bannedUsers.get(guild.id);
      const logChName = await logChannels.get(`logchannel_${guild.id}`);
      const log = guild.channels.cache.find((ch) => ch.name === `${logChName}`);
      if (bannedUsersArr) {
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
      if (remindersArr) {
        remindersArr.forEach(async (reminder) => {
          if (reminder.date <= Date.now()) {
            const member = await guild.members.fetch(reminder.userID);
            member.user.send(`⏰ Time to ${reminder.text}`);
            remindersArr.splice(remindersArr.indexOf(reminder), 1);
          }
        });
        reminders.set(guild.id, remindersArr);

        let mutedMembersArr = await mutedMembers.get(guild.id);
        if (mutedMembersArr) {
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
      }
    });
  }, 60000);
}