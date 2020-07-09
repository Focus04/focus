const Discord = require('discord.js');
const database = require('../database.json');
const Keyv = require('keyv');
const prefixes = new Keyv(database.prefixes);
const fetch = require('node-fetch');
module.exports = {
    name: 'weather',
    description: `Tells you information about the weather in a given location.`,
    usage: 'weather `location`',
    guildOnly: true,
    async execute(message, args) {
        let prefix = await prefixes.get(message.guild.id);
        if (!prefix)
            prefix = '/';
        let location = [];
        for (let i = 0; i < args.length; i++)
            location = location + args[i] + ' ';
        if (!args[0])
            message.channel.send(`Proper command usage: ${prefix}weather [location]`);
        else {
            let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=099789c7e31a10fb1c573df7bd25baf2`)
                .then(res => res.json());
            if (data.message === 'city not found')
                message.channel.send(`Couldn't find any weather results for ${location}.`);
            else {
                let icon;
                if (data.weather[0].icon === '01d')
                    icon = 'https://imgur.com/IP2y4yk';
                else if (data.weather[0].icon === '01n')
                    icon = 'https://imgur.com/fJFxWCv';
                else if (data.weather[0].icon === '02d')
                    icon = 'https://imgur.com/3W0KIIH';
                else if (data.weather[0].icon === '02n')
                    icon = 'https://imgur.com/U1V15j7';
                else if (data.weather[0].icon === '03d')
                    icon = 'https://imgur.com/MZTJBDX';
                else if (data.weather[0].icon === '03n')
                    icon = 'https://imgur.com/mERm42d';
                else if (data.weather[0].icon === '04d')
                    icon = 'https://imgur.com/3UDtHKz';
                else if (data.weather[0].icon === '04n')
                    icon = 'https://imgur.com/04d9Csw';
                else if (data.weather[0].icon === '09d')
                    icon = 'https://imgur.com/pyowl9c';
                else if (data.weather[0].icon === '09n')
                    icon = 'https://imgur.com/8wCPSIV';
                else if (data.weather[0].icon === '10d')
                    icon = 'https://imgur.com/TPsczXq';
                else if (data.weather[0].icon === '10n')
                    icon = 'https://imgur.com/T8iMjEA';
                else if (data.weather[0].icon === '11d')
                    icon = 'https://imgur.com/sddu7KK';
                else if (data.weather[0].icon === '11n')
                    icon = 'https://imgur.com/6COrKvi';
                else if (data.weather[0].icon === '13d')
                    icon = 'https://imgur.com/a1SNLYo';
                else if (data.weather[0].icon === '13n')
                    icon = 'https://imgur.com/X1Yzfqi';
                else if (data.weather[0].icon === '50d')
                    icon = 'https://imgur.com/61ogWDF';
                else if (data.weather[0].icon === '50n')
                    icon = 'https://imgur.com/ObWRUTp';
                let weatherembed = new Discord.MessageEmbed()
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
                message.channel.send(weatherembed);
            }
        }
    }
}