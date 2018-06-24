const commandmodules = require('./commandmodules.js');
const { defaulttype, defaultlabel } = require('../config.json');

const fs = require('fs');

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}


module.exports = {
  name: 'getvalue',
  description: 'Gets a value for a user on this server, including yourself',
  cooldown: 5,
  guildOnly: true,
  aliases: ['v'],
  args: false,
  usage: '{user (optional)}',
  execute(message, args) {
    try {

      fs.readFile('./values.json', function(error, data) {
        fs.readFile('./guildsettings.json', function(settingserror, settingsdata) {

          const guildid = message.guild.id;

          const guildsettings = JSON.parse(settingsdata.toString());

          let type = defaulttype;
          let label = defaultlabel;

          if (guildsettings[guildid] != undefined) {
            if (guildsettings[guildid]['type'] != undefined) {
              type = guildsettings[guildid]['type'];
            }
            if (guildsettings[guildid]['label'] != undefined) {
              label = guildsettings[guildid]['label'];
            }
          }

          const valueslist = JSON.parse(data.toString());

          let value = 0;

          let user = null;
          // get member
          if (!message.mentions.users.size) {
            user = message.guild.members.get(args[0]);
          }
          else {
            user = message.mentions.members.first();
          }

          if (user == undefined) {
            user = message.author;
          }

          const userid = user.id;

          if (valueslist[guildid] != undefined) {
            if (valueslist[guildid][userid] != undefined) {
              value = valueslist[guildid][userid]['value'];
            }

          }

          fs.writeFile('./values.json', JSON.stringify(valueslist));

          commandmodules.setmessage(`${toTitleCase(label.replace('`', '\\`'))}`, `${user}'s ${label.replace('`', '\\`')} is \`${value.replace('`', '')}${type == 2 ? '%' : ''}\`!`, message);
        });
      });
    }
    catch (error) {
      throw error;
    }
  },
};