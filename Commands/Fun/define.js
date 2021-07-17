const Discord = require('discord.js');
const fetch = require('node-fetch')
const { deletionTimeout, reactionError, reactionSuccess } = require('../../config.json');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  name: 'define',
  description: `Looks up a term in the dictionary.`,
  usage: 'define `term`',
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}define [term]`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const term = args.join(' ');
    const response = await fetch(`http://api.urbandictionary.com/v0/define?term=${term}`);
    const data = await response.json();

    if (!data.list[0].definition) {
      let msg = await message.channel.send(`Couldn't find any results for ${term}`);
      msg.delete({ timeout: deletionTimeout });
      return message.react(reactionError);
    }

    const definition = data.list[0].definition
      .split('[')
      .join('')
      .split(']')
      .join('');
    const example = data.list[0].example
      .split('[')
      .join('')
      .split(']')
      .join('');
    let color = getRoleColor(message.guild);
    const defineEmbed = new Discord.MessageEmbed()
      .setColor(color)
      .setTitle(`What does ${args[0]} mean?`)
      .addFields(
        { name: 'Definition', value: '```' + definition + '```' },
        { name: 'Example', value: '```' + (example || 'N/A') + '```' }
      )
      .setTimestamp();
    await message.channel.send(defineEmbed);
    message.react(reactionSuccess);
  }
}