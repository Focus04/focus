const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('contrast')
    .setDescription(`Adds contrast effect to your profile picture or someone else's.`)
    .addUserOption((user) => user
      .setName('user')
      .setDescription('The user you want to add contrast to.')
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser('user') || interaction.user;
    const url = user.displayAvatarURL({ format: 'png' });
    const response = await fetch('https://v1.api.amethyste.moe/generate/contrast', {
      method: 'POST',
      headers: { 'Authorization': process.env.amethyste },
      body: new URLSearchParams({ url }) 
    });
    const bufferArray = await response.arrayBuffer();
    const buffer = Buffer.from(bufferArray);
    const image = new MessageAttachment(buffer);
    interaction.editReply({ files: [image] });
  }
}