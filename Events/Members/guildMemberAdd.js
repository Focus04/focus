const Keyv = require('keyv');
const welcomeChannels = new Keyv(process.env.DB_URI).replace('dbname', 'welcomechannels');
const welcomeRoles = new Keyv(process.env.DB_URI).replace('dbname', 'welcomeroles');
const welcomeMessages = new Keyv(process.env.DB_URI).replace('dbname', 'welcomemessages');
const toggleWelcome = new Keyv(process.env.toggleWelcomeMsg);
const welcomeDms = new Keyv(process.env.DB_URI).replace('dbname', 'welcomedms');
const toggleWelcomeDm = new Keyv(process.env.DB_URI).replace('dbname', 'togglewelcomedm');
const { deafultWelcomeMsg } = require('../../config.json');

module.exports = async (client, member) => {
  const welcomeChName = await welcomeChannels.get(`welcomechannel_${member.guild.id}`);
  const welcome = member.guild.channels.cache.find((ch) => ch.name === welcomeChName);
  const dm = await welcomeDms.get(`welcomedm_${member.guild.id}`);
  let dmState = await toggleWelcomeDm.get(`togglewelcomedm_${member.guild.id}`);
  if (!dmState && dmState != 0) dmState = 1;

  if (dm && dmState == 1) member.send({ content: dm.replace('[user]', member.user.username) });

  const welcomeRoleName = await welcomeRoles.get(`welcomerole_${member.guild.id}`);
  const welcomeRole = member.guild.roles.cache.find((role) => role.name === `${welcomeRoleName}`);
  let state = await toggleWelcome.get(`togglewelcomemsg_${member.guild.id}`);
  if (welcomeRole) member.roles.add(welcomeRole);

  if (!state && state != 0) state = 1;

  if (welcome && state == 1) {
    let msg;
    let welcomeMessage = await welcomeMessages.get(`welcomemessage_${member.guild.id}`);
    if (!welcomeMessage) msg = deafultWelcomeMsg.replace('[user]', member);
    else msg = welcomeMessage.replace('[user]', member);

    welcome.send({ content: msg });
  }
}