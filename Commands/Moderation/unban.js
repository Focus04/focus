const Keyv = require('keyv');
const bannedUsers = new Keyv(process.env.bannedUsers);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'unban',
  description: `Removes a user's banned status earlier.`,
  usage: 'unban `username`',
  requiredPerms: ['BAN_MEMBERS'],
  botRequiredPerms: ['BAN_MEMBERS'],
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}unban username`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const bannedUsersArr = await bannedUsers.get(message.guild.id);
    const bannedUser = bannedUsersArr.find((user) => user.username === args[0]);
    if (!bannedUser) {
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    await message.guild.members.unban(bannedUser.userID).catch(async (err) => {
      console.error(err);
      let msg = await message.channel.send(`${args[0]} isn't banned.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    });

    bannedUsersArr.splice(bannedUsersArr.indexOf(bannedUser), 1);
    await bannedUsers.set(message.guild.id, bannedUsersArr);
    await sendLog(message.guild, message.channel, `${args[0]} has been unbanned earlier.`);
    message.react(reactionSuccess);
  }
}