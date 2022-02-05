const commands = require('../../index');

module.exports = async (client, guild) => {
  client.application.commands.set(commands, guild.id).catch((err) => console.log(err));
}