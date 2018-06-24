const commandmodules = require('./commandmodules.js');

const Discord = require('discord.js');
// we create the embeds for you
const fs = require('fs');
const { defaultprefix } = require('../config.json');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 1,

  execute(message, args) {
    fs.readFile('./guildsettings.json', function(fileerror, data) {

      if (fileerror) throw fileerror;

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

      try {
        const { commands } = message.client;

        if (!args.length) {

          const commandlist = commands.map(command => command.name).join(', ').slice(2);

          const helpmessage = new Discord.RichEmbed()
            .setColor('#5f0aaa')
            .setTitle('Commands Help')
            .addField('Here\'s a list of my commands!', commandlist)
            .addField('Info', `\nYou can send \`${guildprefix}help {command name}\` to get info on that certain special command!`, true)
            .addBlankField()
            .addField('Support', 'DM <@100711360979034112>', true)
            .addField('GitHub', 'https://github.com/Zmxhawrhbg/notaria-mod', true)

            .setTimestamp();

          if (message.channel) message.channel.send({ embed: helpmessage });
          else message.reply({ embed: helpmessage });

          return;

        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
          commandmodules.senderror('That\'s not a valid command!', message);
          return;
        }

        const helpmessage = new Discord.RichEmbed()
          .setColor('#5f0aaa')
          .setTitle(`Help: ${command.name}`)
          .addField('Description', `${command.description}`)
          .addField('Usage', `${guildprefix}${command.name} ${command.usage}`, true)
          .addField('Cooldown', `${command.cooldown || 3} second(s)`);

        if (command.adminOnly) helpmessage.addField('Admin Only', 'true');

        helpmessage.setTimestamp();

        if (message.channel) message.channel.send({ embed: helpmessage });
        else message.reply({ embed: helpmessage });


      }
      catch (error) {
        throw new Error(error);
      }
    });
  },
};