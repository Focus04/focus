const fs = require('fs');
const Discord = require('discord.js');
const database = require('./database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const logchannels = new Keyv(database.logchannels);
const msglogs = new Keyv(database.msglogs);
const welcomechannels = new Keyv(database.welcomechannels);
const welcomemessages = new Keyv(database.welcomemessages);
const togglewelcome = new Keyv(database.togglewelcomememsg);
const welcomedms = new Keyv(database.welcomedms);
const togglewelcomedm = new Keyv(database.togglewelcomedm)
const leavechannels = new Keyv(database.leavechannels);
const leavemessages = new Keyv(database.leavemessages);
const toggleleave = new Keyv(database.toggleleavemsg);
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands');
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}
client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity('your people.', { type: 'WATCHING' });
})
client.on('guildCreate', () => {
    client.user.setActivity('your people.', { type: 'WATCHING' });
})
client.on('guildMemberAdd', async member => {
    let welcomechname = await welcomechannels.get(`welcomechannel_${member.guild.id}`);
    let welcome = member.guild.channels.cache.find(ch => ch.name === welcomechname);
    let dm = await welcomedms.get(`welcomedm_${member.guild.id}`);
    let dmstate = await togglewelcomedm.get(`togglewelcomedm_${member.guild.id}`);
    if(dm && dmstate == 1)
        member.send(dm);
    let state = await togglewelcome.get(`togglewelcomemsg_${member.guild.id}`);
    if (welcome && state == 1) {
        let msg;
        let welcomemessage = await welcomemessages.get(`welcomemessage_${member.guild.id}`);
        if (!welcomemessage)
            msg = `Wish ${member} a pleasant stay!`;
        else
            msg = `${welcomemessage} ${member}`;
        welcome.send(msg);
    }
})
client.on('guildMemberRemove', async member => {
    let leavechname = await leavechannels.get(`leavechannel_${member.guild.id}`);
    let leave = member.guild.channels.cache.find(ch => ch.name === leavechname);
    let state = await toggleleave.get(`toggleleavemsg_${member.guild.id}`);
    if (leave && state == 1) {
        let msg;
        let leavemessage = await leavemessages.get(`leavemessage_${member.guild.id}`);
        if (!leavemessage)
            msg = `${member.user.username} has parted ways with us...`;
        else
            msg = `${leavemessage} ${member.user.username}`;
        leave.send(msg);
    }
})
client.on('messageDelete', async message => {
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = await msglogs.get(`msglogs_${message.guild.id}`);
    if (log && msglog == 1 && !message.author.bot) {
        let deleteembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle('Message Deleted')
            .addFields(
                { name: 'Author:', value: `${message.author.username}` },
                { name: 'Channel:', value: `${message.channel.name}` },
                { name: 'Content:', value: `${message.content}` }
            )
            .setTimestamp();
        log.send(deleteembed);
    }
})
client.on('messageUpdate', async (oldmsg, newmsg) => {
    let logchname = await logchannels.get(`logchannel_${oldmsg.guild.id}`);
    let log = oldmsg.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = await msglogs.get(`msglogs_${oldmsg.guild.id}`);
    if (log && msglog == 1 && !oldmsg.author.bot) {
        let editembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle('Message Edited')
            .addFields(
                { name: 'Author:', value: `${oldmsg.author.username}` },
                { name: 'Channel:', value: `${oldmsg.channel.name}` },
                { name: 'Initial Content:', value: `${oldmsg.content}` },
                { name: 'New Content:', value: `${newmsg.content}` }
            )
            .setTimestamp();
        log.send(editembed);
    }
})
client.on('message', async message => {
    let prefix = "/";
    let customprefix = await prefixes.get(`${message.guild.id}`);
    if (customprefix)
        prefix = customprefix;
    if (!message.content.startsWith(prefix) || message.author.bot)
        return;
    const args = message.content
        .slice(prefix.length)
        .split(/ +/);
    const commandname = args.shift().toLowerCase();
    const command = client.commands.get(commandname);
    if (!command)
        return;
    if (command.guildOnly && message.channel.type !== 'text')
        return message.reply('Nice attempt to slide into my DMs but no thanks! ;)');
    command.execute(message, args);
})
client.login(process.env.token);