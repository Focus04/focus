const fs = require('fs');
const Discord = require('discord.js');
const Keyv = require('keyv');
const svvars = new Keyv(process.env.svvars);
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./Commands');
commandFiles.forEach (file => {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
});

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity('your people.', { type: 'WATCHING' });
})

client.on('guildCreate', async guild => {
    client.user.setActivity('your people.', { type: 'WATCHING' });
    const vars = {
        prefix: "",
        welcomechannel: "",
        leavechannel: "",
        logchannel: "",
        welcomemsg: "",
        welcomedm: "",
        welcomerole: "",
        leavemsg: "",
        togglewelcome: 1,
        toggleleave: 1,
        togglewelcomedm: 1,
        togglemsglogs: 0
    };
    await svvars.set(guild.id, vars);
    
})

client.on('guildMemberAdd', async member => {
    let db = await svvars.get(member.guild.id);
    let welcomechname = db.welcomechannel;
    let welcome = member.guild.channels.cache.find(ch => ch.name === welcomechname);
    let dm = db.welcomedm;
    let dmstate = db.togglewelcomedm;
    if (dm && dmstate == 1)
        member.send(dm.replace('[user]', `${member.user.username}`));
    let welcomerolename = db.welcomerole;
    let welcomerole = member.guild.roles.cache.find(role => role.name === `${welcomerolename}`);
    if (welcomerole)
        member.roles.add(welcomerole);
    let state = db.togglewelcome;
    if (welcome && state == 1) {
        let msg;
        let welcomemessage = db.welcomemsg;
        if (!welcomemessage)
            msg = `Wish ${member} a pleasant stay!`;
        else
            msg = welcomemessage.replace('[user]', `${member}`);
        welcome.send(msg);
    }
})

client.on('guildMemberRemove', async member => {
    let db = await svvars.get(member.guild.id);
    let leavechname = db.leavechannel;
    let leave = member.guild.channels.cache.find(ch => ch.name === leavechname);
    let state = db.toggleleave;
    if (leave && state == 1) {
        let msg;
        let leavemessage = db.leavemsg;
        if (!leavemessage)
            msg = `${member.user.username} has parted ways with us...`;
        else
            msg = leavemessage.replace('[user]', `${member.user.username}`);
        leave.send(msg);
    }
})

client.on('messageDelete', async message => {
    let db = await svvars.get(message.guild.id);
    let logchname = db.logchannel;
    let log = message.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = db.togglemsglogs;
    if (log && msglog == 1 && !message.author.bot) {
        let deleteembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${client.emojis.cache.find(emoji => emoji.name === 'pinned')} Message Deleted`)
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
    let db = await svvars.get(oldmsg.guild.id);
    let logchname = db.logchannel;
    let log = oldmsg.guild.channels.cache.find(ch => ch.name === `${logchname}`);
    let msglog = db.togglemsglogs;
    if (log && msglog == 1 && !oldmsg.author.bot) {
        let editembed = new Discord.MessageEmbed()
            .setColor('#00ffbb')
            .setTitle(`${client.emojis.cache.find(emoji => emoji.name === 'pinned')} Message Edited`)
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
    let db = await svvars.get(message.guild.id);
    let prefix = "/";
    let customprefix = db.prefix;
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