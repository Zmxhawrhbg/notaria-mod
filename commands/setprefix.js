const commandmodules = require('./commandmodules.js');
const { defaultprefix } = require('../config.json');

const fs = require('fs');
module.exports = {
  name: 'setprefix',
  description: 'Set bot prefix on server',
  cooldown: 5,
  guildOnly: true,
  adminOnly: true,
  args: true,
  usage: '[new prefix]',
  execute(message, args) {
    try {

      fs.readFile('./guildsettings.json', function(error, data) {

        const guildid = message.guild.id;

        const guildsettings = JSON.parse(data.toString());

        let oldprefix = defaultprefix;

        if (guildsettings[guildid] != undefined) {
          if (guildsettings[guildid]['prefix'] != undefined) {
            oldprefix = guildsettings[guildid]['prefix'];
          }
        }
        else {

          guildsettings[guildid] = {};
          // make sure dictionary is blank

        }


        const newprefix = args[0];

        guildsettings[guildid].prefix = newprefix;

        fs.writeFileSync('./guildsettings.json', JSON.stringify(guildsettings));

        commandmodules.setmessage('Prefix changed!', `Prefix changed from \`${oldprefix}\` to \`${newprefix}\`!`, message);

      });
    }
    catch (error) {
      throw error;
    }
  },
};