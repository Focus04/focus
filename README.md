# Focus
*Revamp your Discord server. Moderation, role management, logging and more, all in an easy to use, feature rich and bug free Discord bot!*
> It's a really useful and good bot. Easy to manage. I would recommend everyone to add this to their respective servers.

> A really useful and easy to use bot.
## Installation Guide
This guide will cover all the steps needed to get a bot up and running from absolute scratch using my source code. If you stumble across any issues with setting it up, my [Discord server](https://discord.gg/r4bsXez) is the right place to seek help.
Please note though, I strongly advice that you have a decent understanding of JavaScript, Node.js and discord.js before diving into this.
### 1. Creating a Bot Account
*  Open your browser, go to Discord's [Developer Portal](https://discord.com/developers/applications), click on `New Application` and give your application a name.

* Click on the application you've just created and navigate into `Bot`. Here you can give your bot a username, description (that will show up in the About Me section) and an avatar. You want to make sure that the `Server Members Intent` stays enabled.

* In order to have your bot join any servers, you have to create an invite link. The invite url will contain your bot's user ID (which you can copy from the `Application` menu). Simply replace `[your_bot_id]` with your bot client ID you just copied in the template below, then use it to invite the bot.
  ```
  https://discord.com/oauth2/authorize?client_id=[your_bot_id]&permissions=268561494&scope=bot%20applications.commands
  ```
### 2. Connecting The Code To The Bot
* Before downloading the bot's source code, you must download and install [Node.js](https://nodejs.org/en/) on your computer.

* You can now proceed to download [the latest code](https://github.com/Focus04/focus/releases). Scroll to the latest release and download the corresponding zip file, then extract it somewhere on your computer.

* Navigate into the folder you've just extracted (which should contain all the code), right click and open a new terminal in the folder (my recommendation would be [PowerShell 7](https://github.com/PowerShell/powershell/releases) if you're a Windows user). Use the following command to install all the dependencies:
  ```
  npm i
  ```

* Go back to the `Developer Portal` into your browser and navigate into `Bot`. Here you want to click on `Copy` to copy your bot's token. This token is the password for your bot account, so you want to keep that as secure as possible in an environment variable.

* Open the code using your preferred text editor (I recommend sticking to [Visual Studio Code](https://code.visualstudio.com/)). To speed this up, you can type `code.` in the terminal.

* With your text editor, navigate into the `.env` file and replace `your_bot_token` with the token you just copied, then hit save. 
### 3. Configuring the bot
  * The bot uses custom emojis for some of its commands, so it's mandatory that you supply it with custom emoji IDs. One of the cool things about bots is that they have some nitro privileges, which enables them to send custom emojis *anywhere*. With that said, you can proceed to open Discord and create a support server for the bot. There you can upload 7 custom emojis for the 6 different command categories and moderation actions logs (I personally use a pushpin). Or you can upload the emojis to any server as long as it has the bot in it. It's very important that you keep the bot in the server at all times!

  * Go to your `User Settings`, navigate to `Advanced` and enable `Developer Mode`. This will allow you to copy IDs of any Discord element.

  * Back to your server, type a `\` in the message input field, then select one of the custom emojis you uploaded. This will show you the ID of the emoji (an 18 digits number) - copy it. Go to the code editor, open the `config.json` file and replace the `changeme` in `staffEmojiId` with an emoji ID you copied.

  * Repeat for the remaining 6 emojis (editing the `changeme` value in `infoEmojiId`, `loggingEmojiId`, `welcomeEmojiId`, `funEmojiId`, `debugEmojiId` and `pinEmojiId`).

  * The bot offers suggestions and bug reporting features. For those to work, you have to create 2 channels for suggestions and bug reports respectively.

  * Right click on the suggestions channel, then hit `Copy ID`. Replace the `changeme` in the `suggestionChId` field with the ID you copied.

  * Repeat for the bug reports channel by editing the `bugChId` field.

  * You can finally edit your `botInviteLink`, `discordInviteLink`, `topgg`, `website` and `github` fields with your own urls (or leave them empty).

  * You can also edit the `package.json` file.
### 4. Setting up the database
  * Here comes the trickier part, setting up a MongoDB database for the bot to store its data in. Start by registering an account at [MongoDB](https://www.mongodb.com/).

  * Navigate to `Databases`, then hit `Create`. Select your prefered options (there are options for free tier clusters too). When you're done, click `Create Cluster`. The creation process can take several minutes, so be patient.

  * Once the cluster goes live, click on `Browse Collections` and hit `Create Database`. Here you have to create a database for each field in the `.env` file (25 in total). You can start with `bannedUsers`. The name of the database is up to you but make sure it's something suggestive as you'll need it later. You can now click `Create`.

  * Repeat for the remaining fields (`disabledCmds`, `kks`, `leaveMessages`, `leaveChannels`, `logChannels`, `msgLogs`, `mts`, `mutedMembers`, `names`, `notes`, `prefixes`, `punishments`, `reminders`, `rolePickers`, `suggestionChannels`, `toggleLeaveMsg`, `toggleWelcomeDm`, `toggleWelcomeMsg`, `welcomeChannels`, `welcomeDms`, `welcomeMessages`, `welcomeRoles` & `wrns`).

  * Go back to your cluster overview, click `Connect` and choose the second option. Here you have to choose `Node.js` and the `2.2.12 or later` version. Copy the connection string. Replace `database_url` with the url you copied in all fields of the `.env`. Replace `<password>` with the password you set on your cluster. Replace `myFirstDatabase` with the name of the database that you created for the corresponding field. There should be 25 databases in total, which equates to 25 connection strings.
### 5. Generating API Keys
  * In order for the weather command to work, you'll need to generate a key for the [OpenWeatherMap API](https://openweathermap.org/api). Register an account there.
  
  * On the homepage, click on your username and go to `My API keys`.

  * Input a name for your key and hit `Generate`.

  * Copy the newly generated key, go to the `.env` file and replace `your_open_weather_map_api_key` with it.
### 6. Starting up the bot
  * At this point you're pretty much done. You can now run the following command in your terminal to start the bot. Remember to use it everytime you update the source code:
  ```
  node .
  ```