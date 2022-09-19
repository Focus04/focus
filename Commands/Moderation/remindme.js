const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');
const reminders = new Keyv(process.env.DB_URI).replace('dbname', 'reminders');
const punishments = new Keyv(process.env.DB_URI).replace('dbname', 'punishments');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remindme')
    .setDescription(`Sets a timer for a reminder.`)
    .addNumberOption((option) => option
      .setName('days')
      .setDescription(`The amount of days you want to set the reminder for.`)
      .setRequired(true)
    )
    .addStringOption((option) => option
      .setName('text')
      .setDescription(`The text you want to be notified with when the reminder runs out.`)
      .setRequired(true)
    ),
  async execute (interaction) {
    const days = interaction.options.getNumber('days');
    const text = interaction.options.getString('text');
    if (days <= 0) { 
      return interaction.reply({ content: `Days must be a positive number.`, ephemeral: true });
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    let Reminder = {};
    Reminder.userID = interaction.member.user.id;
    Reminder.text = text;
    Reminder.date = Date.now() + days * millisecondsPerDay;
    Reminder.channel = interaction.channel.id;
    let remindersArr = await reminders.get(interaction.guild.id);
    let guilds = await punishments.get('guilds');
    if (!remindersArr) remindersArr = [];
    if (!guilds.includes(interaction.guild.id)) guilds.push(interaction.guild.id);
    remindersArr.push(Reminder);
    await reminders.set(interaction.guild.id, remindersArr);
    await punishments.set('guilds', guilds);
    interaction.reply({ content: `Reminder successfully set for ${days} days from now.`, ephemeral: true });
  }
}