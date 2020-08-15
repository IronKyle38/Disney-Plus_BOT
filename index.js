const Discord = require("discord.js");
const FS = require('fs');
const HTTPS = require("https");
const Package = require("./package.json");
const TMDb_List = require('./TMDb/TMDb_List.json');
const Twitter = require('twitter-lite');

const Google_Form_URL = (process.env.Google_Form_URL);
const TMDB_API_Key = (process.env.TMDb_API_Key);
const TMDb_Movie_List_ID = (process.env.TMDb_Movie_List_ID);
const TMDb_TV_List_ID = (process.env.TMDb_TV_List_ID);
const TMDb_Short_List_ID = (process.env.TMDb_Short_List_ID);

const Discord_Client = new Discord.Client();
let Twitter_Client = new Twitter({
    consumer_key: (process.env.Twitter_API_Key),
    consumer_secret: (process.env.Twitter_API_Secret_Key),
    access_token_key: (process.env.Twitter_Access_Token),
    access_token_secret: (process.env.Twitter_Access_Token_Secret),
});

Discord_Client.commands = new Discord.Collection();
const commandFiles = FS.readdirSync('./Commands/Discord/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./Commands/Discord/${file}`);
    Discord_Client.commands.set(command.name, command);
};

Discord_Client.on("ready", () => {
    console.log("• Bot online !");
    Discord_Client.user.setActivity("Disney+ | !info", { type: "WATCHING" });
});

Discord_Client.on('message', message => {
    let args = message.content.toLowerCase();

    switch (args) {
        case "!bug":
            Discord_Client.commands.get('Bug').execute(Discord, message);
            break;

        case "!credits":
            Discord_Client.commands.get('Credits').execute(Discord, Package, message);
            break;

        case "!info":
            Discord_Client.commands.get('Info').execute(Discord, message);
            break;

        case "!random":
        case "!randomfilm":
        case "!randomserie":
        case "!randomshort":
            Discord_Client.commands.get('Old Command').execute(message);
            break;

        case "!random film":
            Discord_Client.commands.get('Random Film').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!random serie":
            Discord_Client.commands.get('Random Serie').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!random short":
            Discord_Client.commands.get('Random Short').execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message);
            break;

        case "!total":
            Discord_Client.commands.get('Total').execute(HTTPS, TMDb_Movie_List_ID, TMDB_API_Key, TMDb_TV_List_ID, TMDb_Short_List_ID, TMDb_List, Discord, message);
            break;
    };

    if (args.includes("!search")) {
        if (message.author.bot != true) {
            let Search = require("./Commands/Discord/Search.js");
            Search(args, HTTPS, TMDB_API_Key, Discord, message, TMDb_List, Google_Form_URL);
        };
    };
});

let Film_Of_The_Day = require("./Commands/Twitter/Film Of The Day.js");
Film_Of_The_Day(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client);

const stream = Twitter_Client.stream("statuses/filter", { track: "@DisneyPlusBOT" }).on("data", Tweet => {

    var Args = Tweet.text;

    for (let i = 0; i < Tweet.entities.user_mentions.length; i++) {
        Replace = `@${Tweet.entities.user_mentions[i].screen_name} `;
        Args = Args.replace(RegExp(Replace, "g"), "");
    };
    Args = Args.toLowerCase();

    switch (Args) {
        case "bug":
            let Bug = require("./Commands/Twitter/Bug.js");
            Bug(Tweet, Twitter_Client);
            break;

        case "credits":
            let Credits = require("./Commands/Twitter/Credits.js");
            Credits(Package, Tweet, Twitter_Client);
            break;

        case "random film":
            let Random_Film = require("./Commands/Twitter/Random Film.js");
            Random_Film(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client, Tweet);
            break;

        case "random serie":
            let Random_Serie = require("./Commands/Twitter/Random Serie.js");
            Random_Serie(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client, Tweet);
            break;

        case "random short":
            let Random_Short = require("./Commands/Twitter/Random Short.js");
            Random_Short(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client, Tweet);
            break;

        case "total":
            let Total = require("./Commands/Twitter/Total.js");
            Total(HTTPS, TMDb_Movie_List_ID, TMDB_API_Key, TMDb_TV_List_ID, TMDb_Short_List_ID, TMDb_List, Twitter_Client, Tweet);
            break;
    };
});

Discord_Client.login(process.env.Discord_API_Key);