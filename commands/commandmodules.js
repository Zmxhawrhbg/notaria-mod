const Discord = require('discord.js');
exports.senderror = function(message, channel) {
  const errorembed = new Discord.RichEmbed()
    .setColor('#870905')
    .setTitle('Error ⚠')

    .setDescription('❎ ' + message)
    .addField('Help', 'If this message was unexpected/not understandable please DM <@100711360979034112> or open an issue on our GitHub!')

    .setTimestamp();

  if (channel.channel) {channel.channel.send({ embed: errorembed });}
  else {channel.reply({ embed: errorembed });}
};
exports.setmessage = function(title, message, channel) {

  const errorembed = new Discord.RichEmbed()
    .setColor('#5f0aaa')
    .setTitle(title)

    .setDescription(message)

    .setTimestamp();

  if (channel.channel) {channel.channel.send({ embed: errorembed });}
  else {channel.reply({ embed: errorembed });}

};