const Discord = require("discord.js");
const FS = require('fs');
const HTTPS = require("https");
const Package = require("./package.json");
const TMDb_List = require('./TMDb/TMDb_List.json');

const Google_Form_URL = (process.env.Google_Form_URL);
const TMDB_API_Key = (process.env.TMDb_API_Key);
const TMDb_Movie_List_ID = (process.env.TMDb_Movie_List_ID);
const TMDb_TV_List_ID = (process.env.TMDb_TV_List_ID);
const TMDb_Short_List_ID = (process.env.TMDb_Short_List_ID);

const Client = new Discord.Client();

Client.commands = new Discord.Collection();

const commandFiles = FS.readdirSync('./Commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    Client.commands.set(command.name, command);
};

Client.on("ready", () => {
    console.log("• Bot online !");
    Client.user.setActivity("Disney+ | !info", { type: "WATCHING" });
});

Client.on('message', message => {
    let args = message.content.toLowerCase();

    switch (args) {
        case "!bug":
            Client.commands.get('Bug').execute(Discord, message);
            break;

        case "!credits":
            Client.commands.get('Credits').execute(Discord, Package, message);
            break;

        case "!info":
            Client.commands.get('Info').execute(Discord, message);
            break;

        case "!random":
        case "!randomfilm":
        case "!randomserie":
        case "!randomshort":
            Client.commands.get('Old Command').execute(message);
            break;

        case "!random film":
            Client.commands.get('Random Film').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!random serie":
            Client.commands.get('Random Serie').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!random short":
            Client.commands.get('Random Short').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!total":
            Client.commands.get('Total').execute(HTTPS, TMDb_Movie_List_ID, TMDB_API_Key, TMDb_TV_List_ID, TMDb_Short_List_ID, Discord, message);
            break;
    };
});

Client.login(process.env.Discord_API_Key);