const keyv = require('keyv');
const leavechannels = new Keyv(process.env.leavechannels);
const leavemessages = new Keyv(process.env.leavemessages);
const toggleleave = new Keyv(process.env.toggleleave);

module.exports = async member => {
    let leavechname = await leavechannels.get(`leavechannel_${member.guild.id}`);
    let leave = member.guild.channels.cache.find(ch => ch.name === leavechname);
    let state = await toggleleave.get(`toggleleavemsg_${member.guild.id}`) || 1;
    if (leave && state == 1) {
        let msg;
        let leavemessage = await leavemessages.get(`leavemessage_${member.guild.id}`);
        if (!leavemessage)
            msg = `${member.user.username} has parted ways with us...`;
        else
            msg = leavemessage.replace('[user]', `${member.user.username}`);
        leave.send(msg);
    }
}