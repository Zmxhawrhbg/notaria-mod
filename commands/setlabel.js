const commandmodules = require('./commandmodules.js');
const { defaultlabel, defaultprefix } = require('../config.json');

const fs = require('fs');

module.exports = {
  name: 'setlabel',
  description: 'Set label for value on the server',
  cooldown: 5,
  guildOnly: true,
  adminOnly: true,
  args: true,
  usage: '[new label]',
  execute(message) {
    try {

      fs.readFile('./guildsettings.json', function(error, data) {

        const guildid = message.guild.id;

        const guildsettings = JSON.parse(data.toString());

        let oldlabel = defaultlabel;

        let guildprefix = defaultprefix;

        if (guildsettings[guildid] != undefined) {
          if (guildsettings[guildid]['label'] != undefined) {
            oldlabel = guildsettings[guildid]['label'];
          }
          if (guildsettings[guildid]['prefix'] != undefined) {
            guildprefix = guildsettings[guildid]['prefix'];
          }
        }
        else {
          guildsettings[guildid] = {};
        }


        let label = message.content.slice(guildprefix.length).split(' ');


        label.shift().toLowerCase();


        label = label.join(' ');

        const newlabel = label;

        guildsettings[guildid].label = newlabel;


        fs.writeFileSync('./guildsettings.json', JSON.stringify(guildsettings));

        commandmodules.setmessage('Label changed!', `Label changed from \`${oldlabel}\` to \`${newlabel}\`!`, message);

      });
    }
    catch (error) {
      throw error;
    }
  },
};