const commandmodules = require('./commandmodules.js');
const { defaultprefix } = require('../config.json');
const fs = require('fs');

module.exports = {
  name: 'setnick',
  description: 'Set bot nickname on server',
  cooldown: 5,
  guildOnly: true,
  adminOnly: true,
  usage: '[username]',
  execute(message) {
    try {

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
        let name = message.content.slice(guildprefix.length).split(' ');
        name.shift().toLowerCase();
        name = name.join(' ');

        if (name.length > 32) {
          throw 'Invalid nickname!';
        }

        if (message.guild.members.get(message.guild.me.user.id).hasPermission('MANAGE_NICKNAMES') && message.guild.members.get(message.guild.me.user.id).hasPermission('CHANGE_NICKNAME')) {
          message.guild.members.get(message.guild.me.user.id).setNickname(name);

          setTimeout(function() {

            if (message.guild.me.nickname) commandmodules.setmessage('Nickname Changed!', `Nickname changed to \`${message.guild.me.nickname}\`!`, message);
            else commandmodules.setmessage('Nickname reset!', 'Nickname reset back to default!', message);
          }, 500);

        }

        else {
          throw 'I don\'t have the permissions to do that! 😢';
        }
      });
    }
    catch (error) {
      throw new Error(error);
    }
  },
};