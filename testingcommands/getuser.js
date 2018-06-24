const commandmodules = require('./commandmodules.js');

module.exports = {
  name: 'getuser',
  description: 'Get a user (test command)',
  cooldown: 5,
  guildOnly: true,
  args: true,
  usage: '[user]',
  test: true,
  execute(message, args) {
    try {
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

      commandmodules.setmessage('User', user.id, message);

    }
    catch (error) {
      throw error;
    }
  },
};