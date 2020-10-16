import Keyv from 'keyv';
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const welcomeRoles = new Keyv(process.env.welcomeRoles);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const toggleWelcome = new Keyv(process.env.toggleWelcomeMsg);
const welcomeDms = new Keyv(process.env.welcomeDms);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
import { deafultWelcomeMsg } from '../../config.json';

module.exports = async (client, member) => {
  const welcomeChName = await welcomeChannels.get(`welcomechannel_${member.guild.id}`);
  const welcome = member.guild.channels.cache.find((ch) => ch.name === welcomeChName);
  const dm = await welcomeDms.get(`welcomedm_${member.guild.id}`);
  let dmState = await toggleWelcomeDm.get(`togglewelcomedm_${member.guild.id}`);
  if (!dmState && dmState != 0) dmState = 1;

  if (dm && dmState == 1) member.send(dm.replace('[user]', member.user.username));

  const welcomeRoleName = await welcomeRoles.get(`welcomerole_${member.guild.id}`);
  const welcomeRole = member.guild.roles.cache.find((role) => role.name === `${welcomeRoleName}`);
  let state = await toggleWelcome.get(`togglewelcomemsg_${member.guild.id}`);
  if (welcomeRole) member.roles.add(welcomeRole);

  if (!state && state != 0) state = 1;

  if (welcome && state == 1) {
    let msg;
    let welcomeMessage = await welcomeMessages.get(`welcomemessage_${member.guild.id}`);
    if (!welcomeMessage) msg = deafultWelcomeMsg.replace('[member]', member);
    else msg = welcomeMessage.replace('[user]', member);

    welcome.send(msg);
  }
}