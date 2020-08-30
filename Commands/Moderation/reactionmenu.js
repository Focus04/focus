module.exports = {
    name: 'reactionmenu',
    description: 'Creates a menu that automatically assigns roles to users that react to it.',
    usage: 'reactionmenu `emoji` `role` `emoji` `role` etc.',
    guildOnly: true,
    async execute (message, args, prefix) {
        let emojis = [];
        let roles = [];
        if(!args[1]) {
            let msg = await message.channel.send(`Proper command usage: ${prefix}reactionmenu [emoji] [role] [emoji] [role] etc.`);
            msg.delete({timeout: 10000});
            return message.react('❌');
        }
        args.forEach(arg => {
            if(args.indexOf(arg) % 2 == 0)
                emojis.push(arg);
            else
                roles.push(arg);
        });
        console.log(emojis);
    }
}