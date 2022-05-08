import { MessageEmbed, Client, Intents, TextChannel, ColorResolvable, DMChannel } from "discord.js";
const {max_number_of_restarts, version, server_id, bot_errors_id} = require('./config.json');
const {token} = require('./token.json');
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
        if (message.author.bot) return;
        if (message.channel.type === "DM") return;
        if (!message.content.startsWith("~!")) return;
        const command: string = message.content.split(" ")[0].slice(2);
        const args: string[] = message.content.split(" ").slice(1);
        switch (command) {
            case "ping":
                message.channel.send({embeds: [generateembed("Ping 🏓", "Pong!", "#00ff00")]});
                break;
            case "runcode":
                if (message.author.id !== "828718072872828930") return;
                try {
                    var code = args.join(" ");
                    code = code.slice(3 + 2 + 1, code.length - 3);
                    var result = eval(code);
                    if (result !== undefined) {
                        message.channel.send({embeds: [generateembed("Run code 💻", "```\n" + result + "```", "#00ff00")]});
                    }
                }
                catch (e) {
                    message.channel.send({embeds: [generateembed("Run code 💻", "```\n" + e + "```", "#ff0000")]});
                }
        }
    }
    );
    client.login(token);
}
startbot();