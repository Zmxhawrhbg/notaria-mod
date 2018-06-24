# notaria!mod
Notaria mod is a Discord bot created to store values based on user and guild.

## Things to know

* This bot is **still in an alpha state**! Bugs may occur, and values may/may not be reset as save formats could change. Please report all errors to me!

* This bot **may be slow when in a large amount of guilds or in a guild with a lot of users**, as the entire database is stored in JSON files.

* This bot **hasn't been tested all too much** yet.

* Code **may or may not be a mess**. *Be warned.*

## Dependencies

* node.js

* discord.js (running `npm install` should download the node.js dependencies)

## Usage 

#### This bot currently doesn't have a public joining link, so you'll have to host it yourself!

### Hosting

1. Clone/download this repo 

*It is preferable to download from the releases page as those versions have been finished and hopefully have no bugs*

2. Edit `config.json` to your liking

3. Edit `token.json` to include your Discord bot token

4. Make sure `guildsettings.json` and `values.json` are blank JSON files (contents are `{}`)

5. Run bot.js and hope it works!

### Getting started on the server

1. Create the invite link. A permissions integer of `201395200` should work fine, the required permissions for full usage are:

 * Change Nickname

 * Manage Nickname

 * Send Messages

 * Read Message History

2. Setup the bot using the following commands:

* `setlabel` - Sets the label for the value

* `setnick` - Sets the bot nickname on server

* `setprefix` - Sets the prefix for the bot on server (default is `?|`!)

* `settype` - Sets the type of value the bot will be given (view types below)

##### Note that all of the commands starting with `set` can only be used by people with the administrator permission

3. Use the bot

## User Commands

`v` or `getvalue` - gets value for a user or yourself, if one is not specified

`setvalue` - sets a value for a user

`help` - shows help message and support info


## Other Info

##### Types:

* *1* - Value (any number)

* *2* - Percent (any number above 0, shows percent indicator)

* *3* - String (string)

##### How information is stored:

Values are stored by guild id, then user id. Settings are stored by just guild id.