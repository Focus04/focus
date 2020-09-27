const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'weather',
  description: `Tells you information about the weather in a given location.`,
  usage: 'weather `location`',
  guildOnly: true,
  async execute(message, args, prefix) {
    if (!args[0]) {
      let msg = await message.channel.send(`Proper command usage: ${prefix}weather [location]`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
    }

    const location = args.join(' ');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.weatherid}`);
    const data = await response.json();
    let icon;

    if (data.message === 'city not found') {
      let msg = await message.channel.send(`Couldn't find any weather results for ${location}.`);
      msg.delete({ timeout: 10000 });
      return message.react('❌');
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

    const weatherEmbed = new Discord.MessageEmbed()
      .setColor('#00ffbb')
      .setTitle(`Weather in ${data.name}, ${data.sys.country}`)
      .addFields(
        { name: 'Temperature', value: `${data.main.temp} °C` },
        { name: 'Weather Conditions', value: `${data.weather[0].main}` },
        { name: 'Cloudiness', value: `${data.clouds.all} %` },
        { name: 'Humidity', value: `${data.main.humidity} %` },
        { name: 'Pressure', value: `${Math.floor(data.main.pressure / 1.3)} mm Hg` },
        { name: 'Wind', value: `${Math.floor(data.wind.speed * 3.6)} km/h, ${data.wind.deg} °` }
      )
      .setThumbnail(`${icon}.png`)
      .setTimestamp();
    await message.channel.send(weatherEmbed);
    message.react('✔️');
  }
}