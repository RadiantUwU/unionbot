import { MessageEmbed, Client, Intents, TextChannel, ColorResolvable } from "discord.js";
const {max_number_of_restarts, version, server_id, bot_errors_id} = require('./config.json');
const {bot_token} = require('./token.json');
var number_of_restarts: number = 0
function generateembed(title: string, description: string, color: ColorResolvable) {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter({text: "Made by @Radiant#3222 with ❤️ | Version " + version})
        .setTimestamp();
}
function startbot(errored: boolean = false) {
    var client = new Client({
        intents: Intents.FLAGS.GUILDS | Intents.FLAGS.GUILD_MESSAGES
    });
    client.once('ready', () => {
        console.log('Ready!');
        if (errored) {
            client.guilds.fetch(`${server_id}`)
                .then(guild => {
                    guild.channels.fetch(`${bot_errors_id}`)
                        .then(channel => {
                            var ch = channel as TextChannel;
                            ch.send({"embeds":[generateembed("Bot error ❌", "API hanged up socket.", "#ff0000")]});
                        }
                        );
                    }
                );   
        }
    })
    client.once('invalidated', () => {
        console.error('API hang up.');
        if (number_of_restarts < max_number_of_restarts) {
            number_of_restarts++;
            console.log("Attempting to restart...");
            startbot(true);
        }
        else {
            console.log("Too many restarts. Exiting...");
            process.exit(1);
        }
    })
    client.on('messageCreate', message => {
        if (message.content === '~!ping') {
            message.reply('pong');
        }
    }
    );
    client.login(bot_token);
}
startbot();