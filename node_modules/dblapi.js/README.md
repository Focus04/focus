# dblapi.js
An official module for interacting with the top.gg API

## Installation
`npm install dblapi.js`

## Documentation
Documentation can be found [here](https://top.gg/api/docs#jslib)

## Example

### Example of posting server count with supported libraries (Discord.js and Eris)
```js
const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL('Your top.gg token', client);

// Optional events
dbl.on('posted', () => {
  console.log('Server count posted!');
})

dbl.on('error', e => {
 console.log(`Oops! ${e}`);
})
```

### Example of using webhooks to receive vote updates
```js
const DBL = require('dblapi.js');
const dbl = new DBL(yourDBLTokenHere, { webhookPort: 5000, webhookAuth: 'password' });
dbl.webhook.on('ready', hook => {
  console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
});
dbl.webhook.on('vote', vote => {
  console.log(`User with ID ${vote.user} just voted!`);
});
```