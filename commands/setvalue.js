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
  name: 'setvalue',
  description: 'Set a value for a user on this server',
  cooldown: 5,
  guildOnly: true,
  adminOnly: true,
  args: true,
  usage: '[user] [value]',
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

          let oldvalue = 0;

          let user = null;
          if (!message.mentions.users.size) {
            user = message.guild.members.get(args[0]);
          }
          else {
            user = message.mentions.members.first();
          }

          if (user == undefined) {
            commandmodules.senderror('Specified user was incorrect! (User doesn\'t exist)', message);
            return;
          }

          const userid = user.id;

          if (valueslist[guildid] != undefined) {
            if (valueslist[guildid][userid] != undefined) {
              oldvalue = valueslist[guildid][userid]['value'];
            }
            else {
              valueslist[guildid][userid] = {};
            }
          }
          else {

            valueslist[guildid] = {};
            valueslist[guildid][userid] = {};

            // make sure dictionary exists in the first place
          }

          const newvalue = args[1];

          // perform tests to make sure inputs are valid (1 - number, 2 - number, greater than 0, 3+ - anything lol)
          switch(type) {
          case 1:
            if (isNaN(newvalue)) {
              commandmodules.senderror('Invalid input for type! (NaN)', message);
              return;
            }
            break;
          case 2:
            if (!isNaN(newvalue)) {
              if (newvalue < 0) {
                commandmodules.senderror('Invalid input for type! (Too low!)', message);
                return;
              }
            }
            else if (isNaN(newvalue)) {
              commandmodules.senderror('Invalid input for type! (NaN)', message);
              return;
            }
          }

          valueslist[guildid][userid]['value'] = newvalue;

          fs.writeFileSync('./values.json', JSON.stringify(valueslist));

          commandmodules.setmessage(`${toTitleCase(label.replace('`', '\\`'))} changed!`, `${toTitleCase(label.replace('`', '\\`'))} changed from \`${oldvalue}\` to \`${newvalue}\` for ${user}!`, message);
        });
      });
    }
    catch (error) {
      throw error;
    }
  },
};