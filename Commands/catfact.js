const fetch = require('node-fetch');

module.exports = {
    name: 'catfact',
    description: `Same as dogfact, except it's for cats.`,
    usage: 'catfact',
    guildOnly: true,
    async execute(message) {
        let data = await fetch('https://catfact.ninja/facts?limit=1&max_length=140%27')
            .then(res => res.json());
        message.channel.send(data.data[0].fact);
    }
}