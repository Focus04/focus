const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { getRoleColor } = require('../../Utils/getRoleColor');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription(`Tells you information about the weather in a given location.`)
    .addStringOption((option) => option
      .setName('city')
      .setDescription('The city you want to search.')
      .setRequired(true)
    ),
  async execute(interaction) {
    const location = interaction.options.getString('city');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.weatherid}`);
    const data = await response.json();
    let icon;
    if (data.message === 'city not found') {
      return interaction.reply({ content: `Couldn't find any data information for ${'`' + location + '`'}`, ephemeral: true });
    }

    switch (data.weather[0].icon) {
      case ('01d'):
        icon = 'https://imgur.com/IP2y4yk';
        break;
      case ('01n'):
        icon = 'https://imgur.com/fJFxWCv';
        break;
      case ('02d'):
        icon = 'https://imgur.com/3W0KIIH';
        break;
      case ('02n'):
        icon = 'https://imgur.com/U1V15j7';
        break;
      case ('03d'):
        icon = 'https://imgur.com/MZTJBDX';
        break;
      case ('03n'):
        icon = 'https://imgur.com/mERm42d';
        break;
      case ('04d'):
        icon = 'https://imgur.com/3UDtHKz';
        break;
      case ('04n'):
        icon = 'https://imgur.com/04d9Csw';
        break;
      case ('09d'):
        icon = 'https://imgur.com/pyowl9c';
        break;
      case ('09n'):
        icon = 'https://imgur.com/8wCPSIV';
        break;
      case ('10d'):
        icon = 'https://imgur.com/TPsczXq';
        break;
      case ('10n'):
        icon = 'https://imgur.com/T8iMjEA';
        break;
      case ('11d'):
        icon = 'https://imgur.com/sddu7KK';
        break;
      case ('11n'):
        icon = 'https://imgur.com/6COrKvi';
        break;
      case ('13d'):
        icon = 'https://imgur.com/a1SNLYo';
        break;
      case ('13n'):
        icon = 'https://imgur.com/X1Yzfqi';
        break;
      case ('50d'):
        icon = 'https://imgur.com/61ogWDF';
        break;
      case ('50n'):
        icon = 'https://imgur.com/ObWRUTp';
        break;
    }

    let color = getRoleColor(interaction.guild);
    const weatherEmbed = new MessageEmbed()
      .setColor(color)
      .setTitle(`Weather in ${data.name}, ${data.sys.country}`)
      .addFields(
        { name: 'Temperature', value: `${data.main.temp} °C`, inline: true },
        { name: 'Weather Conditions', value: `${data.weather[0].main}`, inline: true },
        { name: 'Cloudiness', value: `${data.clouds.all} %`, inline: true },
        { name: 'Humidity', value: `${data.main.humidity} %`, inline: true },
        { name: 'Pressure', value: `${Math.floor(data.main.pressure / 1.3)} mm Hg`, inline: true },
        { name: 'Wind', value: `${Math.floor(data.wind.speed * 3.6)} km/h, ${data.wind.deg} °`, inline: true }
      )
      .setThumbnail(`${icon}.png`)
      .setTimestamp();
    interaction.reply({ embeds: [weatherEmbed] });
  }
}