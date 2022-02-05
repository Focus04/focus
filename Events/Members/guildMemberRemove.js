const Keyv = require('keyv');
const leaveChannels = new Keyv(process.env.leaveChannels);
const leaveMessages = new Keyv(process.env.leaveMessages);
const toggleLeave = new Keyv(process.env.toggleLeaveMsg);
const { defaultLeaveMsg } = require('../../config.json');

module.exports = async (client, member) => {
  const leaveChName = await leaveChannels.get(`leavechannel_${member.guild.id}`);
  const leave = member.guild.channels.cache.find((ch) => ch.name === leaveChName);
  let state = await toggleLeave.get(`toggleleavemsg_${member.guild.id}`);
  if (!state && state != 0) state = 1;

  if (leave && state == 1) {
    let msg;
    let leaveMessage = await leaveMessages.get(`leavemessage_${member.guild.id}`);
    if (!leaveMessage) msg = defaultLeaveMsg.replace('[user]', member.user.username);
    else msg = leaveMessage.replace('[user]', member.user.username);

    leave.send({ content: msg });
  }
}