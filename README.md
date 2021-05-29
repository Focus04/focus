# Focus
*Revamp your Discord server. Moderation, role management, logging and more, all in an easy to use, feature rich and bug free Discord bot!*
> It's a really useful and good bot. Easy to manage. I would recommend everyone to add this to their respective servers.

> A really useful and easy to use bot.
## Installation Guide
This guide will cover all the steps needed to get a bot up and running from absolute scratch using my source code. If you stumble across any issues with setting it up, my [Discord server](https://discord.gg/r4bsXez) is the right place to seek help.
Please note though, I strongly advice you to have a decent understanding of JavaScript, Node.js and discord.js before diving into this.
### 1. Creating a bot application
*  Open your browser, go to Discord's [Developer Portal](https://discord.com/developers/applications), click on `New Application` and give your application a name.

* Click on the application you've just created and navigate into `Bot`. Here you can give your bot a username and an avatar. You want to make sure that the `Server Members Intent` stays enabled.

* In order to have your bot join any servers, you have to create an invite link. The invite url will contain your bot's user ID (which you can copy from the `Application` menu). Simply replace `[your_bot_id]` with your bot client ID you just copied in the template below, then use the link to invite the bot, just like you would invite any other bot.
  ```
  https://discord.com/oauth2/authorize?client_id=[your_bot_id]&permissions=268561494&scope=bot%20applications.commands
  ```
### 2. Starting up the bot
* Before downloading the bot's source code, you must download and install [Node.js](https://nodejs.org/en/) on your computer.

* You can now proceed to download [the latest code](https://github.com/Focus04/focus/releases). Scroll to the latest release and download the corresponding zip file, then extract it somewhere on your computer.

* Navigate into the folder you've just extracted (which should contain all the code), right click and open a new terminal in the folder (my recommendation would be [PowerShell 7](https://github.com/PowerShell/powershell/releases) if you're a Windows user). Use the following command to install all the dependencies:
  ```
  npm i
  ```

* Go back to the `Developer Portal` into your browser and navigate into `Bot`. Here you want to click on `Copy` to copy your bot's token. This token is the password for your bot account, so you want to keep that as secure as possible in an environment variable.

* Open the code using your preferred text editor (I recommend sticking to [Visual Studio Code](https://code.visualstudio.com/)).

* With your text editor, navigate into the `.env` file and replace `your_bot_token` with the token you just copied, then hit save. 

* You can now run the following command to start the bot. Remember to use it everytime you update the source code (which you will several times over the course of this guide):
  ```
  node .
  ```
### 3. Configuring the bot
  * The bot uses custom emojis for some of its commands, so it's mandatory that you supply it with custom emoji IDs. One of the cool things about bots is that they have some nitro privileges, which enables them to send custom emojis from any guild they are in *anywhere*. With that said, you can proceed to open Discord and upload 7 custom emojis to your server for the 6 different command categories and moderation actions logs (I personally use a pushpin 😛). Important, make sure the server you upload your emojis to has the bot in it, otherwise it won't be able to send them.

  * Go to your `User Settings`, navigate to `Advanced` and enable `Developer Mode`. This will allow you to copy IDs of any Discord element.

  * Back to your server, type a `\` in the message input field, then select one of the custom emojis you uploaded. This will show you the ID of the emoji (an 18 digits number) - copy it. Go to the code editor, open the `config.json` file and replace the `changeme` in `staffEmojiId` with an emoji ID you copied.

  * Repeat for the remaining 6 emojis (editing the `changeme` value in `infoEmojiId`, `loggingEmojiId`, `welcomeEmojiId`, `funEmojiId`, `debugEmojiId` and `pinEmojiId`).

  * The bot offers suggestions and bug reporting features. For those to work, you have to create a support server for your bot. Add 2 channels for suggestions and bug reports respectively.

  * Right click on the suggestions channel, then hit `Copy ID`. Replace the `changeme` in the `suggestionChId` field with the ID you copied.

  * Repeat for the bug reports channel by editing the `bugChId` field.

  * You can finally edit your `botInviteLink`, `discordInviteLink`, `topgg`, `website` and `github` fields with your own urls (or leave them empty).

  * You can also edit the `package.json` file.