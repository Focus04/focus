const fs = require('fs');
const Discord = require('discord.js');
const Keyv = require('keyv');
const prefixes = new Keyv(process.env.prefixes);
const logchannels = new Keyv(process.env.logchannels);
const msglogs = new Keyv(process.env.msglogs);
const welcomechannels = new Keyv(process.env.welcomechannels);
const welcomeroles = new Keyv(process.env.welcomeroles);
const welcomemessages = new Keyv(process.env.welcomemessages);
const togglewelcome = new Keyv(process.env.togglewelcome);
const welcomedms = new Keyv(process.env.welcomedms);
const togglewelcomedm = new Keyv(process.env.togglewelcomedm)
const leavechannels = new Keyv(process.env.leavechannels);
const leavemessages = new Keyv(process.env.leavemessages);
const toggleleave = new Keyv(process.env.toggleleave);
const client = new Discord.Client();

client.commands = new Discord.Collection();
fs.readdirSync('./Commands').forEach(folder => {
    fs.readdirSync(`./Commands/${folder}`).forEach(file => {
        const command = require(`./Commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    });
});

fs.readdirSync('./Events').forEach(folder => {
    fs.readdirSync(`./Events/${folder}`).forEach(file =>{
        const event = require(`./Events/${folder}/${file}`);
        client.on(event.name, event.bind(null, client));
    });
});

client.on('guildCreate', () => {
    client.user.setActivity('your people.', { type: 'WATCHING' });
})

client.on('guildMemberAdd', async member => {
    let welcomechname = await welcomechannels.get(`welcomechannel_${member.guild.id}`);
    let welcome = member.guild.channels.cache.find(ch => ch.name === welcomechname);
    let dm = await welcomedms.get(`welcomedm_${member.guild.id}`);
    let dmstate = await togglewelcomedm.get(`togglewelcomedm_${member.guild.id}`) || 1;
    if (dm && dmstate == 1)
        member.send(dm.replace('[user]', `${member.user.username}`));
    let welcomerolename = await welcomeroles.get(`welcomerole_${member.guild.id}`);
    let welcomerole = member.guild.roles.cache.find(role => role.name === `${welcomerolename}`);
    if (welcomerole)
        member.roles.add(welcomerole);
    let state = await togglewelcome.get(`togglewelcomemsg_${member.guild.id}`) || 1;
    if (welcome && state == 1) {
        let msg;
        let welcomemessage = await welcomemessages.get(`welcomemessage_${member.guild.id}`);
        if (!welcomemessage)
            msg = `Wish ${member} a pleasant stay!`;
        else
            msg = welcomemessage.replace('[user]', `${member}`);
        welcome.send(msg);
    }
})

client.on('guildMemberRemove', async member => {
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
})

client.on('messageDelete', async message => {
    let logchname = await logchannels.get(`logchannel_${message.guild.id}`);
    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = await msglogs.get(`msglogs_${message.guild.id}`);
    if (log && msglog == 1 && !message.author.bot) {
        let deleteembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${message.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Message Deleted`)
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
            .setTitle(`${oldmsg.client.emojis.cache.find(emoji => emoji.name === 'pinned')} Message Edited`)
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
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = client.commands.get(args.shift().toLowerCase());
    if (!command)
        return;
    if (command.guildOnly && message.channel.type !== 'text')
        return message.reply('Nice attempt to slide into my DMs but no thanks! ;)');
    command.execute(message, args, prefix);
})

client.login(process.env.token);