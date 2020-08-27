const fetch = require('node-fetch');

module.exports = {
    name: 'dogfact',
    description: `Sends a lovely dog fact.`,
    usage: 'dogfact',
    guildOnly: true,
    async execute(message) {
        let response = await fetch('https://dog-api.kinduff.com/api/facts');
        let data = await response.json();
        message.channel.send(data.facts[0]);
    }
}