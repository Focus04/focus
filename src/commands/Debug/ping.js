module.exports = {
  name: 'ping',
  description: `Displays the bot's current latency in ms.`,
  usage: 'ping',
  async execute(message) {
    let msg = await message.channel.send('Pinging...');
    msg.edit(`Response Latency: ${Math.floor(msg.createdTimestamp - message.createdTimestamp)} ms`);
  }
}