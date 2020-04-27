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

client.on("ready", () => {
    console.log("Bot online !");
    client.user.setActivity("Disney+ | !info", {type : "WATCHING"})
});

client.on("message", function (message) {
    if (message.content.toLowerCase() === "!random film") {

        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/4/list/"+TMDB_list_movies+"?api_key="+TMDB_api_key,
            "headers": {
              "content-type": "application/json;charset=utf-8"
            }
        };

        var request = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body_movie = Buffer.concat(chunks);
                var data_movie = body_movie.toString();
                var data_parse_movie = JSON.parse(data_movie);
                TMDB_movie_random = Math.floor(Math.random() * data_parse_movie.total_results);

                if (TMDB_movie_random === 0) {
                    TMDB_movie_page = 1

                } else {
                    TMDB_movie_page = (Math.trunc(TMDB_movie_random/20))+1
                    TMDB_movie_random = TMDB_movie_random-(20*(TMDB_movie_page-1))
                }
                     
                    var options = {
                        "method": "GET",
                        "hostname": "api.themoviedb.org",
                        "port": null,
                        "path": "/4/list/"+TMDB_list_movies+"?page="+TMDB_movie_page+"&api_key="+TMDB_api_key+"&language=fr-FR",
                        "headers": {
                        "content-type": "application/json;charset=utf-8"
                        }
                    };      

                    var request = http.request(options, function (res) {
                        var chunks = [];
                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        });
                        res.on("end", function () {
                            var body_movie = Buffer.concat(chunks);
                            var data_movie = body_movie.toString();
                            var data_parse_movie = JSON.parse(data_movie);

                            var note_movie = ""
                            if (data_parse_movie.results[TMDB_movie_random].vote_average < 0.5) {
                                note_movie = "Note indisponible"
                            } else {
                                for (let i = 0; i < Math.round(data_parse_movie.results[TMDB_movie_random].vote_average); i++) {
                                    note_movie = note_movie + "❤️"
                                }
                                for (let i = 0; i < (10-Math.round(data_parse_movie.results[TMDB_movie_random].vote_average)); i++) {
                                    note_movie = note_movie + "🤍"
                                }
                            }

                            var genres_movie = ""
                            for (let i = 0; i < data_parse_movie.results[TMDB_movie_random].genre_ids.length; i++) {
                                genres_movie = genres_movie + TMDB_genres_movie[data_parse_movie.results[TMDB_movie_random].genre_ids[i]]
                                if (i + 1 < data_parse_movie.results[TMDB_movie_random].genre_ids.length) {
                                    genres_movie = genres_movie + ", " 
                                }
                            }
     
                            const embed_movie = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle(data_parse_movie.results[TMDB_movie_random].title)
                                .setURL("https://www.themoviedb.org/"+data_parse_movie.results[TMDB_movie_random].media_type+"/"+data_parse_movie.results[TMDB_movie_random].id)
                                .setDescription(data_parse_movie.results[TMDB_movie_random].overview)
                                .addFields(
                                    { name: 'Date de sortie', value: data_parse_movie.results[TMDB_movie_random].release_date, inline: true },
                                    { name: 'Note', value: note_movie, inline: true },
                                    { name: 'Genres', value: genres_movie },
                                )
                                .setThumbnail("https://image.tmdb.org/t/p/original"+data_parse_movie.results[TMDB_movie_random].poster_path)
                                .setImage("https://image.tmdb.org/t/p/original"+data_parse_movie.results[TMDB_movie_random].backdrop_path)
                                .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            message.channel.send(embed_movie);
                            console.log("Command !random film use.");
                        });
                    });
                    request.write(JSON.stringify({}));
                    request.end();
            });
        });
        request.write(JSON.stringify({}));
        request.end();
    }
    if (message.content.toLowerCase() === "!random serie") {

        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/4/list/"+TMDB_list_TV+"?api_key="+TMDB_api_key+"&language=fr",
            "headers": {
              "content-type": "application/json;charset=utf-8"
            }
        };

        var request = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body_TV = Buffer.concat(chunks);
                var data_TV = body_TV.toString();
                var data_parse_TV = JSON.parse(data_TV);

                TMDB_TV_random = Math.floor(Math.random() * data_parse_TV.total_results);

                if (TMDB_TV_random === 0) {
                    TMDB_TV_page = 1

                } else {
                    TMDB_TV_page = (Math.trunc(TMDB_TV_random/20))+1
                    TMDB_TV_random = TMDB_TV_random-(20*(TMDB_TV_page-1))
                }

                    var options = {
                        "method": "GET",
                        "hostname": "api.themoviedb.org",
                        "port": null,
                        "path": "/4/list/"+TMDB_list_TV+"?page="+TMDB_TV_page+"&api_key="+TMDB_api_key+"&language=fr-FR",
                        "headers": {
                        "content-type": "application/json;charset=utf-8"
                        }
                    };

                    var request = http.request(options, function (res) {
                        var chunks = [];
                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        });
                        res.on("end", function () {
                            var body_TV = Buffer.concat(chunks);
                            var data_TV = body_TV.toString();
                            var data_parse_TV = JSON.parse(data_TV);

                            var note_TV = ""
                            if (data_parse_TV.results[TMDB_TV_random].vote_average < 0.5) {
                                note_TV = "Note indisponible"
                            } else {
                                for (let i = 0; i < Math.round(data_parse_TV.results[TMDB_TV_random].vote_average); i++) {
                                    note_TV = note_TV + "❤️"
                                }
                                for (let i = 0; i < (10-Math.round(data_parse_TV.results[TMDB_TV_random].vote_average)); i++) {
                                    note_TV = note_TV + "🤍"
                                }
                            }
    
                            var genres_TV = ""
                            for (let i = 0; i < data_parse_TV.results[TMDB_TV_random].genre_ids.length; i++) {
                                genres_TV = genres_TV + TMDB_genres_TV[data_parse_TV.results[TMDB_TV_random].genre_ids[i]]
                                if (i + 1 < data_parse_TV.results[TMDB_TV_random].genre_ids.length) {
                                    genres_TV = genres_TV + ", " 
                                }
                            }

                            const embed_TV = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle(data_parse_TV.results[TMDB_TV_random].name)
                                .setURL("https://www.themoviedb.org/"+data_parse_TV.results[TMDB_TV_random].media_type+"/"+data_parse_TV.results[TMDB_TV_random].id)
                                .setDescription(data_parse_TV.results[TMDB_TV_random].overview)
                                .addFields(
                                    { name: 'Première diffusion', value: data_parse_TV.results[TMDB_TV_random].first_air_date, inline: true },
                                    { name: 'Note', value: note_TV, inline: true },
                                    { name: 'Genres', value: genres_TV },
                                )
                                .setThumbnail("https://image.tmdb.org/t/p/original"+data_parse_TV.results[TMDB_TV_random].poster_path)
                                .setImage("https://image.tmdb.org/t/p/original"+data_parse_TV.results[TMDB_TV_random].backdrop_path)
                                .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            message.channel.send(embed_TV);
                            console.log("Command !random serie use.")
                        });
                    });
                    request.write(JSON.stringify({}));
                    request.end();
            });
        });
        request.write(JSON.stringify({}));
        request.end();
    }
    if (message.content.toLowerCase() === "!random short") {

        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/4/list/"+TMDB_list_shorts+"?api_key="+TMDB_api_key,
            "headers": {
              "content-type": "application/json;charset=utf-8"
            }
        };

        var request = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body_short = Buffer.concat(chunks);
                var data_short = body_short.toString();
                var data_parse_short = JSON.parse(data_short);

                TMDB_short_random = Math.floor(Math.random() * data_parse_short.total_results);

                if (TMDB_short_random === 0) {
                    TMDB_short_page = 1

                } else {
                    TMDB_short_page = (Math.trunc(TMDB_short_random/20))+1
                    TMDB_short_random = TMDB_short_random-(20*(TMDB_short_page-1))
                }

                    var options = {
                        "method": "GET",
                        "hostname": "api.themoviedb.org",
                        "port": null,
                        "path": "/4/list/"+TMDB_list_shorts+"?page="+TMDB_short_page+"&api_key="+TMDB_api_key+"&language=fr-FR",
                        "headers": {
                        "content-type": "application/json;charset=utf-8"
                        }
                    };

                    var request = http.request(options, function (res) {
                        var chunks = [];
                        res.on("data", function (chunk) {
                            chunks.push(chunk);
                        });
                        res.on("end", function () {
                            var body_short = Buffer.concat(chunks);
                            var data_short = body_short.toString();
                            var data_parse_short = JSON.parse(data_short);

                            var note_short = ""
                            if (data_parse_short.results[TMDB_short_random].vote_average < 0.5) {
                                note_short = "Note indisponible"
                            } else {
                                for (let i = 0; i < Math.round(data_parse_short.results[TMDB_short_random].vote_average); i++) {
                                    note_short = note_short + "❤️"
                                }
                                for (let i = 0; i < (10-Math.round(data_parse_short.results[TMDB_short_random].vote_average)); i++) {
                                    note_short = note_short + "🤍"
                                }
                            }

                            var genres_short = ""
                            for (let i = 0; i < data_parse_short.results[TMDB_short_random].genre_ids.length; i++) {
                                genres_short = genres_short + TMDB_genres_movie[data_parse_short.results[TMDB_short_random].genre_ids[i]]
                                if (i + 1 < data_parse_short.results[TMDB_short_random].genre_ids.length) {
                                    genres_short = genres_short + ", " 
                                }
                            }
   
                            const embed_short = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle(data_parse_short.results[TMDB_short_random].title)
                                .setURL("https://www.themoviedb.org/"+data_parse_short.results[TMDB_short_random].media_type+"/"+data_parse_short.results[TMDB_short_random].id)
                                .setDescription(data_parse_short.results[TMDB_short_random].overview)
                                .addFields(
                                    { name: 'Date de sortie', value: data_parse_short.results[TMDB_short_random].release_date, inline: true },
                                    { name: 'Note', value: note_short, inline: true },
                                    { name: 'Genres', value: genres_short },
                                )
                                .setThumbnail("https://image.tmdb.org/t/p/original"+data_parse_short.results[TMDB_short_random].poster_path)
                                .setImage("https://image.tmdb.org/t/p/original"+data_parse_short.results[TMDB_short_random].backdrop_path)
                                .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            message.channel.send(embed_short);
                            console.log("Command !random short use.")
                        });
                    });
                    request.write(JSON.stringify({}));
                    request.end();
            });
        });
        request.write(JSON.stringify({}));
        request.end();
    }
    if (message.content.toLowerCase() === "!total") {

        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/4/list/"+TMDB_list_movies+"?api_key="+TMDB_api_key,
            "headers": {
              "content-type": "application/json;charset=utf-8"
            }
        };

        var request = http.request(options, function (res) {
            var chunks = [];
            res.on("data", function (chunk) {
                chunks.push(chunk);
            });
            res.on("end", function () {
                var body = Buffer.concat(chunks);
                var data_movie = body.toString();
                var data_parse_movie = JSON.parse(data_movie);

                var options = {
                    "method": "GET",
                    "hostname": "api.themoviedb.org",
                    "port": null,
                    "path": "/4/list/"+TMDB_list_TV+"?api_key="+TMDB_api_key,
                    "headers": {
                      "content-type": "application/json;charset=utf-8"
                    }
                };

                var request = http.request(options, function (res) {
                    var chunks = [];
                    res.on("data", function (chunk) {
                        chunks.push(chunk);
                    });
                    res.on("end", function () {
                        var body_TV = Buffer.concat(chunks);
                        var data_TV = body_TV.toString();
                        var data_parse_TV = JSON.parse(data_TV);

                        var options = {
                            "method": "GET",
                            "hostname": "api.themoviedb.org",
                            "port": null,
                            "path": "/4/list/"+TMDB_list_shorts+"?api_key="+TMDB_api_key,
                            "headers": {
                              "content-type": "application/json;charset=utf-8"
                            }
                        };

                        var request = http.request(options, function (res) {
                            var chunks = [];
                            res.on("data", function (chunk) {
                                chunks.push(chunk);
                            });
                            res.on("end", function () {
                                var body_short = Buffer.concat(chunks);
                                var data_short = body_short.toString();
                                var data_parse_short = JSON.parse(data_short);

                                runtime = data_parse_movie.runtime+data_parse_TV.runtime+data_parse_short.runtime
                                days = Math.trunc(runtime/1440)
                                hours = Math.trunc((runtime-(days*1440))/60)
                                minutes = runtime-(days*1440)-(hours*60)

                                message.reply(
                                    "\nIl y a plus de : **"+(data_parse_movie.total_results+data_parse_TV.total_results+data_parse_short.total_results)+"** titres différents à visionner sur Disney+ ! 🍿"+
                                    "\nDont, **"+data_parse_movie.total_results+"** films, **"+data_parse_TV.total_results+"** séries et **"+data_parse_short.total_results+"** courts-métrages !"+
                                    "\nCe qui représente : **"+days+"** jours, **"+hours+"** heures et **"+minutes+"** minutes de divertissements ! ⏲️"
                                )
                                console.log("Command !total use.")
                            });
                        });
                        request.write(JSON.stringify({}));
                        request.end();   
                    });
                });
                request.write(JSON.stringify({}));
                request.end();  
            });
        });
        request.write(JSON.stringify({}));
        request.end();
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
            "\nUtilise :"+
            "\n`!info` pour lire ce message. 👀"+
            "\n"+
            "\n`!random film` pour découvrir un **film** au hasard."+
            "\n`!random serie` pour découvrir une **série** au hasard."+
            "\n`!random short` pour découvrir un **court-métrage** au hasard."+
            "\n"+
            "\n`!total` pour connaitre le nombre total de titres disponibles sur Disney+. 🎞️"+
            "\n"+
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
            "\nCode source disponible sur GitHub :"+
            "\n||https://github.com/IronKyle38/Discord-Plus||"+
            "\n"+
            "\nSources des données __Chronique Disney__ et __TMDb__"+
            "\nDiscord+ utilise l'API TMDb mais n'est ni approuvé ni certifié par TMDb."+
            "\n"+
            "\nVersion : "+package.version+
            "\n© Copyright - IronKyle38 - Avril 2020"
        )
        console.log("Command !credits use.")
    }
    if (message.content.toLocaleLowerCase() === "!random") {
        message.reply(
            "\nCette commande n'est plus diponible."+
            "\nUtilise à la place `!random film`, `!random serie` ou `!random short`."+
            "\nToutes les commandes disponibles sont accessibles en tapant `!info`."
        )
        console.log("Command !random use.")
    }
    if (message.content.toLocaleLowerCase() === "!randomfilm") {
        message.reply(
            "\nCette commande n'est plus diponible."+
            "\nUtilise à la place `!random film`, `!random serie` ou `!random short`."+
            "\nToutes les commandes disponibles sont accessibles en tapant `!info`."
        )
        console.log("Command !randomfilm use.")
    }
    if (message.content.toLocaleLowerCase() === "!randomserie") {
        message.reply(
            "\nCette commande n'est plus diponible."+
            "\nUtilise à la place `!random film`, `!random serie` ou `!random short`."+
            "\nToutes les commandes disponibles sont accessibles en tapant `!info`."
        )
        console.log("Command !randomserie use.")
    }
    if (message.content.toLocaleLowerCase() === "!randomshort") {
        message.reply(
            "\nCette commande n'est plus diponible."+
            "\nUtilise à la place `!random film`, `!random serie` ou `!random short`."+
            "\nToutes les commandes disponibles sont accessibles en tapant `!info`."
        )
        console.log("Command !randomshort use.")
    }
});

client.login(process.env.Discord_api_key);