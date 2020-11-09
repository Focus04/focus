const Discord = require('discord.js');
const Keyv = require('keyv');
const logChannels = new Keyv(process.env.logChannels);
const welcomeChannels = new Keyv(process.env.welcomeChannels);
const leaveChannels = new Keyv(process.env.leaveChannels);
const welcomeMessages = new Keyv(process.env.welcomeMessages);
const welcomeDms = new Keyv(process.env.welcomeDms);
const leaveMessages = new Keyv(process.env.leaveMessages);
const toggleWelcomeMsg = new Keyv(process.env.toggleWelcomeMsg);
const toggleWelcomeDm = new Keyv(process.env.toggleWelcomeDm);
const toggleLeaveMsg = new Keyv(process.env.toggleLeaveMsg);
const { reactionSuccess, deafultWelcomeMsg, defaultLeaveMsg } = require('../../config.json');

module.exports = {
  name: 'botinfo',
  description: 'Sends current bot settings for this server.',
  usage: 'botinfo',
  requiredPerms: 'KICK_MEMBERS',
  permError: 'You require the Kick Members permission in order to run this command.',
  async execute(message, args, prefix) {
    const logChannel = await logChannels.get(`logchannel_${message.guild.id}`);
    if(!logChannel) logChannel = 'N/A';

    const welcomeChannel = await welcomeChannels.get(`welcomechannel_${message.guild.id}`);
    if(!welcomeChannel) welcomeChannel = 'N/A';

    const leaveChannel = await leaveChannels.get(`leavechannel_${message.guild.id}`);
    if(!leaveChannel) leaveChannel = 'N/A';

    const welcomeMessage = await welcomeMessages.get(`welcomemessage_${message.guild.id}`);
    if(!welcomeMessage) welcomeMessage = deafultWelcomeMsg;

    const leaveMessage = await leaveMessages.get(`leavemessage_${message.guild.id}`);
    if(!leaveMessage) leaveMessage = defaultLeaveMsg;

    const welcomeDm = await welcomeDms.get(`welocmedm_${message.guild.id}`);
    if(!welcomeDm) welcomeDm = 'N/A';

    const welcomeMessageState = await toggleWelcomeMsg.get(`togglewelcomemsg_${message.guild.id}`);
    if (!welcomeMessageState && welcomeMessageState != 0) welcomeMessageState = 'enabled';
    else welcomeMessageState = 'disabled';

    const welcomeDmState = await toggleWelcomeDm.get(`togglewelcomedm_${message.guild.id}`);
    if(!welcomeDmState && welcomeDmState != 0) welcomeDmState = 'enabled';
    else welcomeDmState = 'disabled';

    const leaveMessageState = await toggleLeaveMsg.get(`toggleleavemsg_${message.guild.id}`);
    if(!leaveMessageState && leaveMessageState != 0) leaveMessageState = 'enabled';
    else leaveMessageState = 'disabled';

    const botSettingsEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`Bot settings for ${message.guild.name}`)
      .addFields(
        { name: 'Log Channel', value: '```' + logChannel + '```', inline: true },
        { name: 'Welcome Channel', value: '```' + welcomeChannel + '```', inline: true },
        { name: 'Leave Channel', value: '```' + leaveChannel + '```', inline: true },
        { name: 'Welcome Message', value: '```' + `${welcomeMessage} [${welcomeMessageState}]` + '```', inline: true },
        { name: 'Welcome DM', value: '```' + `${welcomeDm} [${welcomeDmState}]` + '```', inline: true},
        { name: 'Leave Message', value: '```' + `${leaveMessage} [${leaveMessageState}]` + '```', inline: true }
      )
      .setTimestamp();
    await message.channel.send(botSettingsEmbed);
    message.react(reactionSuccess);
  }
}