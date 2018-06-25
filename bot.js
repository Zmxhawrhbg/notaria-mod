const fs = require('fs');
const Discord = require('discord.js');
const { defaultprefix } = require('./config.json');
const { token } = require('./token.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.on('ready', () => {
  console.log('Ready!');
  client.user.setActivity(`something fun! ~ try using ${defaultprefix} to talk to me!`);
});

client.on('message', message => {

  fs.readFile('./guildsettings.json', function(fileerror, data) {

    if (fileerror) {
      console.log(fileerror);
      senderror(fileerror, message);
      return;
    }

    let guildprefix = defaultprefix;
    if (message.guild) {
      const guildid = message.guild.id;

      const guildsettings = JSON.parse(data.toString());


      if (guildsettings[guildid] != undefined) {
        if (guildsettings[guildid]['prefix'] != undefined) {
          guildprefix = guildsettings[guildid]['prefix'];
        }
      }
    }

    if (!message.content.startsWith(guildprefix) || message.author.bot) return;

    const args = message.content.slice(guildprefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) ||
      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      senderror('Command not found!', message);
      return;
    }

    if (command.guildOnly && message.channel.type !== 'text') {
      return senderror('I can\'t execute that command inside DMs!', message);
    }

    if (command.adminOnly && !message.member.hasPermission('MANAGE_MESSAGES', false, true, true)) {
      return senderror('Only people with admin permissions can use this command', message);
    }

    if (command.args && !args.length) {
      let reply = 'No arguments given!';

      if (command.usage) {
        reply += `\nUse the command like: \`${guildprefix}${command.name} ${command.usage}\``;
      }

      return senderror(reply, message);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return senderror(`Please wait ${timeLeft.toFixed(1)} more second(s) before using \`${command.name}\`! ⏰`, message);
      }

      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
      command.execute(message, args);
    }
    catch (error) {
      console.error(error);
      senderror(error, message);
    }
  });
});

client.login(token);

function senderror(message, channel) {
  const errorembed = new Discord.RichEmbed()
    .setColor('#870905')
    .setTitle('Error ⚠')

    .setDescription('❎ ' + message)

    .addField('Help', 'If this message was unexpected/not understandable please DM <@100711360979034112> or open an issue on our GitHub!')
    .setTimestamp();

  if (channel.channel) channel.channel.send({ embed: errorembed });
  else channel.reply({ embed: errorembed });

}