const Discord = require("discord.js");
const package = require("./package.json");
const client = new Discord.Client();

const TMDB_api_key = (process.env.TMDB_api_key);
const TMDB_list_movies = (process.env.TMDB_list_movies);
const TMDB_list_TV = (process.env.TMDB_list_TV);
const TMDB_list_shorts = (process.env.TMDB_list_shorts);
const TMDB_genres_movie = require("./TMDb/Genre_Movie.json")
const TMDB_genres_TV = require("./TMDb/Genre_TV.json")

var http = require("https");

const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => {
    console.log("\x1b[34m%s\x1b[0m", "Bot online !");
    client.user.setActivity("Disney+ | !info", { type: "WATCHING" })
});

client.on('message', message => {
    let args = message.content.toLowerCase();

    switch (args) {
        case "!info":
            client.commands.get('Info').execute(Discord, message);
            break;

        case "!random film":
            client.commands.get('Random Film').execute(TMDB_list_movies, TMDB_api_key, http, TMDB_genres_movie, Discord, message);
            break;

        case "!random serie":
            client.commands.get('Random Serie').execute(TMDB_list_TV, TMDB_api_key, http, TMDB_genres_TV, Discord, message);
            break;

        case "!random short":
            client.commands.get('Random Short').execute(TMDB_list_shorts, TMDB_api_key, http, TMDB_genres_movie, Discord, message);
            break;

        case "!total":
            client.commands.get('Total').execute(TMDB_list_movies, TMDB_api_key, http, TMDB_list_TV, TMDB_list_shorts, message);
            break;

        case "!bug":
            client.commands.get('Bug').execute(message)
            break;

        case "!credits":
            client.commands.get('Credits').execute(message, package)
            break;

        case "!random":
        case "!randomfilm":
        case "!randomserie":
        case "!randomshort":
            client.commands.get('Old Command').execute(message);
            break;
    }
});

client.login(process.env.Discord_api_key);