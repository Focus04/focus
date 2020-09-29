const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'define',
  description: `Looks up a term in the dictionary.`,
  usage: 'define `term`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}define [term]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const term = args.join(' ');
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${term}?key=${process.env.dictionary}`);
    const data = await response.json();
    let synonyms;

    if (!data[0].meta) {
      let msg = await message.channel.send(`Couldn't find any results for ${term}`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    if (data[0].meta.syns[0]) {
      let synonyms = '```';
      data[0].meta.syns[0].forEach((syn) => synonyms = synonyms + syn + ', ');
      synonyms = synonyms + '```';
    }

    const defineEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`What does ${args[0]} mean?`)
      .addFields(
        { name: 'Definition', value: `${data[0].def[0].sseq[0][0][1].dt[0][1]}` },
        { name: 'Synonyms', value: `${synonyms || 'N/A'}` }
      )
      .setTimestamp();
    await message.channel.send(defineEmbed);
    message.react('✔️');
  }
}