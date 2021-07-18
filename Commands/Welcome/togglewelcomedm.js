const Keyv = require('keyv');
const welcomeDms = new Keyv(process.env.welcomeDms);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { sendLog } = require('../../Utils/sendLog');

module.exports = {
  name: 'togglewelcomedm',
  description: `Toggles welcome DMs on/off.`,
  usage: 'toggleWelcomedm',
  requiredPerms: ['MANAGE_GUILD'],
  async execute(message, prefix) {
    const welcomeDm = await welcomeDms.get(`welcomedm_${message.guild.id}`);
    let logs = await toggleWelcomeDm.get(`togglewelcomedm_${message.guild.id}`);
    let state;

    if (!welcomeDm) {
      let msg = await message.channel.send(`You first need to set a welcome DM. Use ${prefix}welcomedm to setup one.`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }
    
    if (logs == 0) {
      logs = 1;
      state = 'on';
    } else {
      logs = 0;
      state = 'off';
    }

    await toggleWelcomeDm.set(`togglewelcomedm_${message.guild.id}`, logs);
    await sendLog(message.guild, message.channel, `Welcome DMs are now set to ${'`' + state + '`'}`);
    message.react(reactionSuccess);
  }
}