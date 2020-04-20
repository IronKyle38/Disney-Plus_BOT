const Discord = require("discord.js");
const list = require("./Lists/List.json");
const list_movie = require("./Lists/List_Movie.json");
const list_serie = require("./Lists/List_Serie.json");
const list_short = require("./Lists/List_Short.json");
const package = require("./package.json");
const sentence = require("./Sentence/Sentence.json");
const sentence_movie = require("./Sentence/Sentence_Movie.json");
const sentence_serie = require("./Sentence/Sentence_Serie.json");
const sentence_short = require("./Sentence/Sentence_Short.json");
const client = new Discord.Client();

client.on("ready", () => {
    console.log("Bot online !");
    client.user.setActivity("Disney+ | !info", {type : "WATCHING"})
});

client.on("message", function (message) {
    if (message.content.toLowerCase() === "!random") {
        title_id = list[Math.floor(Math.random() * (list.length))]
        sentence_id = sentence[Math.floor(Math.random() * (sentence.length))]
        message.channel.send(
            `>>> ${sentence_id}https://www.imdb.com/title/${title_id}`
        )
        console.log("Command !random use.")
    }
    if (message.content.toLowerCase() === "!randomfilm") {
        title_id = list_movie[Math.floor(Math.random() * (list_movie.length))]
        sentence_id = sentence_movie[Math.floor(Math.random() * (sentence_movie.length))]
        message.channel.send(
            `>>> ${sentence_id}https://www.imdb.com/title/${title_id}`
        )
        console.log("Command !randomfilm use.")
    }
    if (message.content.toLowerCase() === "!randomserie") {
        title_id = list_serie[Math.floor(Math.random() * (list_serie.length))]
        sentence_id = sentence_serie[Math.floor(Math.random() * (sentence_serie.length))]
        message.channel.send(
            `>>> ${sentence_id}https://www.imdb.com/title/${title_id}`
        )
        console.log("Command !randomserie use.")
    }
    if (message.content.toLowerCase() === "!randomshort") {
        title_id = list_short[Math.floor(Math.random() * list_short.length)]
        sentence_id = sentence_short[Math.floor(Math.random() * (sentence_short.length))]
        message.channel.send(
            `>>> ${sentence_id}https://www.imdb.com/title/${title_id}`
        )
        console.log("Command !randomshort use.")
    }
    if (message.content.toLowerCase() === "!total") {
        message.reply(
            "\nIl y a plus de : **"+list.length+"** titres différents à visionner sur Disney+ ! 🍿"+
            "\nDont, **"+list_movie.length+"** films, **"+list_serie.length+"** séries et **"+list_short.length+"** courts-métrages !"
        )
        console.log("Command !total use.")
    }
    if (message.content.toLowerCase() === "!bug") {
        console.log("Command !bug use.")
        message.author.send(
            "Bonjour,"+
            "\nSi tu as découvert un bug ou si tu souhaites m'envoyer une suggestion n'hésites pas !"+
            "\nRemplis juste ce formulaire : https://docs.google.com/forms/d/1DhWFKKc1yp7kG6dCvwYLt0a9GxyvcNjQaw40VQzgu98/"+
            "\nMerci pour ton aide. :heart:"
        )
        .catch(() => {
            message.reply(
                "je ne peux pas t'envoyer de messages privés. 😢"+
                "\nMerci de vérifier tes paramètres de confidentialités afin d'autoriser les messages privés en provenance des membres du serveur. ✉️"
            )
            console.log("Can't send private messages to user.")
        })
    }
    if (message.content.toLowerCase() === "!info") {
        message.reply(
            "\nTu ne sais pas quoi regarder sur Disney+ ?"+
            "\nJe vais t'aider à trouver la pépite qu'il te faut !"+
            "\n"+
            "\nUtilises :"+
            "\n`!info` pour lire ce message. 👀"+
            "\n`!random` pour découvrir un titre au hasard parmi tout le catalogue. 🍿"+
            "\n"+
            "\n`!randomfilm` pour découvrir un **film** au hasard."+
            "\n`!randomserie` pour découvrir une **série** au hasard."+
            "\n`!randomshort` pour découvrir un **court-métrage** au hasard."+
            "\n"+
            "\n`!total` pour connaitre le nombre total de titres disponibles sur Disney+. 🎞️"+
            "\n`!bug` pour signaler un bug, un titre absent de Disney+ ou envoyer un commentaire (envoie via MP). 📝"+
            "\n`!credits` pour découvrir qui m'a donné la vie. ❤️"
        )
        console.log("Command !info use.")
    }
    if (message.content.toLowerCase() === "!credits") {
        message.channel.send(
            ">>> Créé avec amour par **IronKyle38** 🧡"+
            "\nCodé en JavaScript avec Node.js sur Visual Studio Code"+
            "\n"+
            "\nSources des données __Chronique Disney__ et __IMDb__"+
            "\nCatalogue Disney+ sur Chronique Disney :"+
            "\n||https://www.chroniquedisney.fr/programme/catalogue-disneyplus.php||"+
            "\n"+
            "\nVersion : "+package.version+
            "\n© Copyright - IronKyle38 - Avril 2020"
        )
        console.log("Command !credits use. (Via MP)")
    }
});

client.login(process.env.TOKEN);