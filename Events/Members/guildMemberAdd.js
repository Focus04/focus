const Keyv = require('keyv');
const welcomechannels = new Keyv(process.env.welcomechannels);
const welcomeroles = new Keyv(process.env.welcomeroles);
const welcomemessages = new Keyv(process.env.welcomemessages);
const togglewelcome = new Keyv(process.env.togglewelcomemsg);
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.togglewelcomedm);

module.exports = async (client, member) => {
  let welcomechname = await welcomechannels.get(`welcomechannel_${member.guild.id}`);
  let welcome = member.guild.channels.cache.find((ch) => ch.name === welcomechname);
  let dm = await welcomedms.get(`welcomedm_${member.guild.id}`);
  let dmstate = await togglewelcomedm.get(`togglewelcomedm_${member.guild.id}`);
  if (!dmstate && dmstate != 0) dmstate = 1;

  if (dm && dmstate == 1) member.send(dm.replace('[user]', `${member.user.username}`));

  let welcomerolename = await welcomeroles.get(`welcomerole_${member.guild.id}`);
  let welcomerole = member.guild.roles.cache.find((role) => role.name === `${welcomerolename}`);
  let state = await togglewelcome.get(`togglewelcomemsg_${member.guild.id}`);
  if (welcomerole) member.roles.add(welcomerole);

  if (!state && state != 0) state = 1;

  if (welcome && state == 1) {
    let msg;
    let welcomemessage = await welcomemessages.get(`welcomemessage_${member.guild.id}`);
    if (!welcomemessage) msg = `Wish ${member} a pleasant stay!`;
    else msg = welcomemessage.replace('[user]', `${member}`);

    welcome.send(msg);
  }
}