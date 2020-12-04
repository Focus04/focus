const Keyv= require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const logChannels = new Keyv(process.env.logChannels);

module.exports = (client) => {
  console.log('I am live!');
  client.user.setActivity('your people.', { type: 'WATCHING' });
  setInterval(() => {
    client.guilds.cache.forEach(async (guild) => {
      let bannedUsersArr = await bannedUsers.get(guild.id);
      const logChName = await logChannels.get(`logchannel_${guild.id}`);
      const log = guild.channels.cache.find((ch) => ch.name === `${logChName}`);
      if (bannedUsersArr) {
        let i = 0;
        bannedUsersArr.forEach((user) => {
          if (user.unbanDate <= Date.now()) {
            const banInfo = guild.fetchBan(user.userID);
            if (banInfo) {
              bannedUsersArr.splice(i, 1);
              guild.members.unban(user.userID);
              if (log) log.send(`${user.username} has been unbanned.`);
            }
          }
          i++;
        });
      }
      if (bannedUsersArr) bannedUsers.set(guild.id, bannedUsersArr);
    });
  }, 60000)
}