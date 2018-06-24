const commandmodules = require('./commandmodules.js');
const { defaulttype } = require('../config.json');

const fs = require('fs');
module.exports = {
  name: 'settype',
  description: 'Set display type for value on the server',
  cooldown: 5,
  guildOnly: true,
  adminOnly: true,
  args: true,
  usage: '[value|percent|string]',
  execute(message, args) {
    try {

      fs.readFile('./guildsettings.json', function(error, data) {

        const guildid = message.guild.id;

        const guildsettings = JSON.parse(data.toString());

        let oldtype = defaulttype;

        if (guildsettings[guildid] != undefined) {
          if (guildsettings[guildid]['type'] != undefined) {
            oldtype = guildsettings[guildid]['type'];

          }
        }
        else {
          guildsettings[guildid] = {};
        }


        const newtype = args[0];

        let inttype = oldtype;

        switch(newtype) {
        case 'value':
          inttype = 1;
          break;
        case 'percent':
          inttype = 2;
          break;
        case 'string':
          inttype = 3;
          break;
        default:
          commandmodules.senderror('Incorrect type!', message);
          return;
        }

        guildsettings[guildid].type = inttype;

        fs.writeFile('./guildsettings.json', JSON.stringify(guildsettings));

        fs.readFile('./values.json', function(valueserror, valuesdata) {
          // clearing out the old existing values

          const values = JSON.parse(valuesdata.toString());

          values[guildid] = {};

          fs.writeFile('./values.json', JSON.stringify(values));

          let oldtypestr = oldtype;

          switch (oldtype) {
          case 1:
            oldtypestr = 'value';
            break;
          case 2:
            oldtypestr = 'percent';
            break;
          case 3:
            oldtypestr = 'string';
            break;
          default:
            oldtypestr = 'something';
            break;
          }

          commandmodules.setmessage('Type changed!', `Type changed from \`${oldtypestr}\` to \`${newtype}\`!`, message);
        });

      });
    }
    catch (error) {
      throw error;
    }
  },
};