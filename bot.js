const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('./config.json');
const prefix = config.prefix;

var query = require('samp-query')

var options = {
    host: '185.204.216.149'
}

bot.on('ready', () => {
  console.log(`Ładowanie ustawień..`);
  setInterval(function() {
    bot.user.setActivity(query(options, function (error, response) {
        if(error)
            console.log(error)
        else 
            bot.user.setActivity("Wind-City - " + response.online + "/" + response.maxplayers);
      }), { type: `WATCHING` });
  }, 10000)
  console.log(`Załadowano pomyślnie!`)
  console.log(`Zalogowano na ${bot.user.tag}.`);
  console.log(`Zaproszenie bota: https://discordapp.com/oauth2/authorize?client_id=703208325080285195&scope=bot&permissions=2146958847`);
});

bot.on('message', message => {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    var offChannel = []

    if (message.author.bot) return;

    if (cmd === `${prefix}online`) {
        query(options, function (error, response) {
            if(error)
                console.log(error)
            else 
                if (response.online == 0) {
                  var online = "Nikt nie gra :(";
                } else {
                  var playerNames = []
                  response.players.forEach(player => playerNames.push(player.id + ". " + player.name))
                  var online = playerNames.join('\n')
                }
                message.channel.send("Aktualnie na serwerze przebywa: " + response.online + "/" + response.maxplayers + "\n```" + online + "```")
          });
    }

    if (cmd === `${prefix}info`) {
      query(options, function (error, response) {
        if(error)
            console.log(error)
        else //Połącz się z serwerem, [kliknij](SAMP://185.204.216.149:7777).
        message.channel.send({embed: {
          timestamp: new Date(),
          fields: [
            {
              name: "Informacje o serwerze",
              value: "Nazwa: " + response.hostname + "\nLiczba graczy: " + response.online + "/" + response.maxplayers + "\nWersja: " + response.rules.version + "\nAby poznać liste graczy, użyj ;online"
            }
          ],
          thumbnail: {
            url: "https://i.imgur.com/1Iy0oJ2.png"
          },
          footer: {
            text: 'Wykonane przez ' + message.author.username,
            icon_url: message.author.avatarURL,
        },
        }});
      });
    }

    if (cmd === `${prefix}help`) {
      message.channel.send({embed: {
        fields: [
          {
            name: "**Podstawowe**",
            value: "**;help** - wszystkie komendy dotyczące bota\n**;online** - lista graczy przebywających aktualnie na serwerze\n**;info** - krótkie info o serwerze"
          },
          {
            name: "**Moderacyjne**",
            value: "_ERROR: Couldn't open file /utils/modcmd.txt_"
          }
        ]
      }})
    }

    if (cmd === `${prefix}warn`) {
      if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({embed:{fields:[{name: "**Brak permissji**", value: "Nie posiadsz permissji."}]}});
      let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if (!user) return message.channel.send({embed:{fields:[{name: "**Nie znaleziono**", value: "Nie odnaleziono takiej osoby!"}]}});
      var reason = messageArray.slice(2).join(" ")
      if (!reason) reason = "Złamanie regulaminu"


    }

});

bot.login(config.token);