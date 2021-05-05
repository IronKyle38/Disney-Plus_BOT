module.exports = function Search(args, HTTPS, TMDB_API_Key, Discord, message, TMDb_List, Google_Form_URL) {
    args_split = args.split(" ");

    switch (args_split[1]) {
        case "movie":
            args = args.replace(RegExp("!search movie ", "g"), "");

            HTTPS.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_Key}&language=fr-FR&query=${encodeURI(args)}&page=1&include_adult=false`, (req) => {
                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                });

                req.on('end', () => {
                    data_parse = JSON.parse(data);

                    switch (data_parse.total_results) {
                        case 0:
                            console.log(`• Search command use ("${args}") (0 movie found) (via Discord).`);
                            message.reply(
                                "\n⚠️ Aucun titre n'a été trouvé. ⚠️" +
                                "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                            )
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                });
                            break;

                        case 1:
                            if (data_parse.results[0].release_date === undefined) {
                                Release_Date = `[••••](${Google_Form_URL}!search+movie&entry.1530119858=${encodeURI(data_parse.results[0].title)})`;
                            } else {
                                Release_Date = data_parse.results[0].release_date.split("-")[0];
                            };

                            const Movie_Result_Embed = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle("1 résultat")
                                .setDescription(
                                    "\nLe titre suivant a été trouvé :" +
                                    `\n\n**[${data_parse.results[0].title}](https://www.themoviedb.org/movie/${data_parse.results[0].id})**, sorti en ${Release_Date}` +
                                    "\n\nCorrespond-il à celui recherché ?"
                                )
                                .addFields(
                                    {
                                        name: 'Fonctionnement', value:
                                            "Utilise les réactions pour valider (ou non) ta recherche." +
                                            "\nTu as **30 secondes** pour le faire sinon ta recherche sera annulée." +
                                            "\n✅ = Oui" +
                                            "\n❎ = Non",
                                        inline: true
                                    },
                                )
                                .setThumbnail(`https://image.tmdb.org/t/p/original${data_parse.results[0].poster_path}`)
                                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            console.log(`• Search command use ("${args}") (1 movie found) (via Discord).`);
                            message.channel.send(Movie_Result_Embed)
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                })
                                .then(Movie_Poll_Message => {
                                    Movie_Poll_Message.react('✅').then(() => Movie_Poll_Message.react('❎'));

                                    const filter = (reaction, user) => {
                                        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    Movie_Poll_Message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                        .then(collected => {
                                            const reaction = collected.first();

                                            if (reaction.emoji.name === '✅') {
                                                Movie_Poll_Message.delete();
                                                Result(0, "Movie");
                                            } else {
                                                Movie_Poll_Message.delete();
                                                message.reply(
                                                    "\n⚠️ Aucun autre titre n'a été trouvé. ⚠️" +
                                                    "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                                                )
                                                    .catch((error) => {
                                                        console.log(`○ ${error.name} : ${error.message}`);
                                                    });
                                            };
                                        })
                                        .catch(collected => {
                                            Movie_Poll_Message.delete();
                                            message.reply("\n❌ Ta recherche a été annulée. ❌");
                                        });
                                });
                            break;

                        default:
                            Reply = "\nLes titres suivant ont été trouvés :\n";
                            if (data_parse.total_results > 5) {
                                j = 5;
                            } else {
                                j = data_parse.total_results;
                            };

                            for (let i = 0; i < j; i++) {
                                if (data_parse.results[i].release_date === undefined) {
                                    Release_Date = `[••••](${Google_Form_URL}!search+movie&entry.1530119858=${encodeURI(data_parse.results[i].title)})`;
                                } else {
                                    Release_Date = data_parse.results[i].release_date.split("-")[0];
                                };
                                Reply += `\n:${i + 1}: : **[${data_parse.results[i].title}](https://www.themoviedb.org/movie/${data_parse.results[i].id})**, sorti en ${Release_Date}`;
                            };

                            const Movie_Results_Embed = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle("Plusieurs résultats")
                                .setDescription(
                                    Reply.replace(":1:", ":one:").replace(":2:", ":two:").replace(":3:", ":three:").replace(":4:", ":four:").replace(":5:", ":five:")
                                )
                                .addFields(
                                    {
                                        name: 'Fonctionnement', value:
                                            "Utilise les réactions 1️⃣ à 5️⃣ pour valider (ou non) ta recherche." +
                                            "\nUtilise ❎ pour annuler ta recherche." +
                                            "\nTu as **30 secondes** pour le faire sinon ta recherche sera annulée.",
                                        inline: true
                                    },
                                )
                                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            console.log(`• Search command use ("${args}") (${data_parse.total_results} movie found) (via Discord).`);
                            message.channel.send(Movie_Results_Embed)
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                })
                                .then(Movie_Poll_Message => {
                                    Movie_Poll_Message.react('1️⃣')
                                        .then(() => Movie_Poll_Message.react('2️⃣'))
                                        .then(() => { if (j > 2) Movie_Poll_Message.react('3️⃣') })
                                        .then(() => { if (j > 3) Movie_Poll_Message.react('4️⃣') })
                                        .then(() => { if (j > 4) Movie_Poll_Message.react('5️⃣') })
                                        .then(() => Movie_Poll_Message.react('❎'));

                                    const filter = (reaction, user) => {
                                        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    Movie_Poll_Message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                        .then(collected => {
                                            const reaction = collected.first();

                                            switch (reaction.emoji.name) {
                                                case '1️⃣':
                                                    Movie_Poll_Message.delete();
                                                    Result(0, "Movie");
                                                    break;

                                                case '2️⃣':
                                                    Movie_Poll_Message.delete();
                                                    Result(1, "Movie");
                                                    break;

                                                case '3️⃣':
                                                    Movie_Poll_Message.delete();
                                                    Result(2, "Movie");
                                                    break;

                                                case '4️⃣':
                                                    Movie_Poll_Message.delete();
                                                    Result(3, "Movie");
                                                    break;

                                                case '5️⃣':
                                                    Movie_Poll_Message.delete();
                                                    Result(4, "Movie");
                                                    break;

                                                case '❎':
                                                    Movie_Poll_Message.delete();
                                                    message.reply("\n❌ Ta recherche a été annulée. ❌");
                                                    break;

                                                default:
                                                    Movie_Poll_Message.delete();
                                                    message.reply(
                                                        "\n⚠️ Aucun autre titre n'a été trouvé. ⚠️" +
                                                        "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                                                    )
                                                        .catch((error) => {
                                                            console.log(`○ ${error.name} : ${error.message}`);
                                                        });
                                                    break;
                                            };
                                        })
                                        .catch(collected => {
                                            Movie_Poll_Message.delete();
                                            message.reply("\n❌ Ta recherche a été annulée. ❌");
                                        });
                                });
                            break;
                    };
                });
            });
            break;

        case "serie":
            args = args.replace(RegExp("!search serie ", "g"), "");

            HTTPS.get(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_Key}&language=fr-FR&query=${encodeURI(args)}&page=1&include_adult=false`, (req) => {
                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                });

                req.on('end', () => {
                    data_parse = JSON.parse(data);

                    switch (data_parse.total_results) {
                        case 0:
                            console.log(`• Search command use ("${args}") (0 serie found) (via Discord).`);
                            message.reply(
                                "\n⚠️ Aucun titre n'a été trouvé. ⚠️" +
                                "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                            )
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                });
                            break;

                        case 1:
                            if (data_parse.results[0].first_air_date === undefined) {
                                Release_Date = `[••••](${Google_Form_URL}!search+movie&entry.1530119858=${encodeURI(data_parse.results[0].name)})`;
                            } else {
                                Release_Date = data_parse.results[0].first_air_date.split("-")[0];
                            };

                            const TV_Result_Embed = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle("1 résultat")
                                .setDescription(
                                    "\nLe titre suivant a été trouvé :" +
                                    `\n\n**[${data_parse.results[0].name}](https://www.themoviedb.org/tv/${data_parse.results[0].id})**, sorti en ${Release_Date}` +
                                    "\n\nCorrespond-il à celui recherché ?"
                                )
                                .addFields(
                                    {
                                        name: 'Fonctionnement', value:
                                            "Utilise les réactions pour valider (ou non) ta recherche." +
                                            "\nTu as **30** secondes pour le faire sinon ta recherche sera annulée." +
                                            "\n✅ = Oui" +
                                            "\n❎ = Non",
                                        inline: true
                                    },
                                )
                                .setThumbnail(`https://image.tmdb.org/t/p/original${data_parse.results[0].poster_path}`)
                                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            console.log(`• Search command use ("${args}") (1 serie found) (via Discord).`);
                            message.channel.send(TV_Result_Embed)
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                })
                                .then(TV_Poll_Message => {
                                    TV_Poll_Message.react('✅').then(() => TV_Poll_Message.react('❎'));

                                    const filter = (reaction, user) => {
                                        return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    TV_Poll_Message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                        .then(collected => {
                                            const reaction = collected.first();

                                            if (reaction.emoji.name === '✅') {
                                                TV_Poll_Message.delete();
                                                Result(0, "TV");
                                            } else {
                                                TV_Poll_Message.delete();
                                                message.reply(
                                                    "\n⚠️ Aucun autre titre n'a été trouvé. ⚠️" +
                                                    "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                                                )
                                                    .catch((error) => {
                                                        console.log(`○ ${error.name} : ${error.message}`);
                                                    });
                                            };
                                        })
                                        .catch(collected => {
                                            TV_Poll_Message.delete();
                                            message.reply("\n❌ Ta recherche a été annulée. ❌");
                                        });
                                });
                            break;

                        default:
                            Reply = "\nLes titres suivant ont été trouvés :\n";
                            if (data_parse.total_results > 5) {
                                j = 5;
                            } else {
                                j = data_parse.total_results;
                            };

                            for (let i = 0; i < j; i++) {
                                if (data_parse.results[i].first_air_date === undefined) {
                                    Release_Date = `[••••](${Google_Form_URL}!search+movie&entry.1530119858=${encodeURI(data_parse.results[i].name)})`;
                                } else {
                                    Release_Date = data_parse.results[i].first_air_date.split("-")[0];
                                };
                                Reply += `\n:${i + 1}: : **[${data_parse.results[i].name}](https://www.themoviedb.org/tv/${data_parse.results[i].id})**, sorti en ${Release_Date}`;
                            };

                            const TV_Results_Embed = new Discord.MessageEmbed()
                                .setColor('#01b4e4')
                                .setTitle("Plusieurs résultats")
                                .setDescription(
                                    Reply.replace(":1:", ":one:").replace(":2:", ":two:").replace(":3:", ":three:").replace(":4:", ":four:").replace(":5:", ":five:")
                                )
                                .addFields(
                                    {
                                        name: 'Fonctionnement', value:
                                            "Utilise les réactions 1️⃣ à 5️⃣ pour valider (ou non) ta recherche." +
                                            "\nUtilise ❎ pour annuler ta recherche." +
                                            "\nTu as **30** secondes pour le faire sinon ta recherche sera annulée.",
                                        inline: true
                                    },
                                )
                                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                            console.log(`• Search command use ("${args}") (${data_parse.total_results} serie found) (via Discord).`);
                            message.channel.send(TV_Results_Embed)
                                .catch((error) => {
                                    console.log(`○ ${error.name} : ${error.message}`);
                                })
                                .then(TV_Poll_Message => {
                                    TV_Poll_Message.react('1️⃣')
                                        .then(() => TV_Poll_Message.react('2️⃣'))
                                        .then(() => { if (j > 2) TV_Poll_Message.react('3️⃣') })
                                        .then(() => { if (j > 3) TV_Poll_Message.react('4️⃣') })
                                        .then(() => { if (j > 4) TV_Poll_Message.react('5️⃣') })
                                        .then(() => TV_Poll_Message.react('❎'));

                                    const filter = (reaction, user) => {
                                        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    TV_Poll_Message.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
                                        .then(collected => {
                                            const reaction = collected.first();

                                            switch (reaction.emoji.name) {
                                                case '1️⃣':
                                                    TV_Poll_Message.delete();
                                                    Result(0, "TV");
                                                    break;

                                                case '2️⃣':
                                                    TV_Poll_Message.delete();
                                                    Result(1, "TV");
                                                    break;

                                                case '3️⃣':
                                                    TV_Poll_Message.delete();
                                                    Result(2, "TV");
                                                    break;

                                                case '4️⃣':
                                                    TV_Poll_Message.delete();
                                                    Result(3, "TV");
                                                    break;

                                                case '5️⃣':
                                                    TV_Poll_Message.delete();
                                                    Result(4, "TV");
                                                    break;

                                                case '❎':
                                                    Movie_Poll_Message.delete();
                                                    message.reply("\n❌ Ta recherche a été annulée. ❌");
                                                    break;

                                                default:
                                                    TV_Poll_Message.delete();
                                                    message.reply(
                                                        "\n⚠️ Aucun autre titre n'a été trouvé. ⚠️" +
                                                        "\nVérifie qu'il n'y a pas de fautes d'orthographes ou réessaie en tapant le titre en anglais ou dans une autre langue."
                                                    )
                                                        .catch((error) => {
                                                            console.log(`○ ${error.name} : ${error.message}`);
                                                        });
                                                    break;
                                            };
                                        })
                                        .catch(collected => {
                                            TV_Poll_Message.delete();
                                            message.reply("\n❌ Ta recherche a été annulée. ❌");
                                        });
                                });
                            break;
                    };
                });
            });
            break;

        default:
            console.log("• Search command use (type not mentioned) (via Discord).");
            message.reply(
                "\nMerci de spécifier le type de titre que tu souhaites rechercher." +
                "\nUtilise ``!search movie <Nom du titre>`` pour rechercher un film ou un court-métrage." +
                "\nUtilise ``!search serie <Nom du titre>`` pour rechercher une série."
            )
                .catch((error) => {
                    console.log(`○ ${error.name} : ${error.message}`);
                });
            break;
    };

    function Result(x, Type) {
        switch (Type) {
            case "Movie":
                Title = data_parse.results[x].title;
                TEST = TMDb_List.Movie.filter(a => a.ID == data_parse.results[x].id);
                if (TEST[0] === undefined) {
                    TEST = TMDb_List.Short.filter(a => a.ID == data_parse.results[x].id);
                };
                break;

            case "TV":
                Title = data_parse.results[x].name;
                TEST = TMDb_List.TV.filter(a => a.ID == data_parse.results[x].id);
                break;
        }

        if (TEST[0] != undefined) {
            const Search_Embed = new Discord.MessageEmbed()
                .setColor('#01b4e4')
                .setTitle(`▶ Disponible sur Disney+ ! ◀`)
                .setURL(`https://www.disneyplus.com/${TEST[0].URL}`)
                .setDescription(
                    `**[${Title}](https://www.themoviedb.org/${Type.toLowerCase()}/${data_parse.results[x].id})** est disponible sur Disney+ depuis le **${TEST[0].Date}** !` +
                    "\nBon visionnage ! 🍿"
                )
                .setThumbnail(`https://image.tmdb.org/t/p/original${data_parse.results[x].poster_path}`)
                .setImage(`https://image.tmdb.org/t/p/original${data_parse.results[x].backdrop_path}`)
                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
            console.log(`• Search command use (${Type} available on Disney+) (via Discord).`);
            message.channel.send(Search_Embed)
                .catch((error) => {
                    console.log(`○ ${error.name} : ${error.message}`);
                });

        } else {
            const Search_Embed = new Discord.MessageEmbed()
                .setColor('#01b4e4')
                .setTitle(`Indisponible sur Disney+`)
                .setDescription(
                    `**[${Title}](https://www.themoviedb.org/${Type.toLowerCase()}/${data_parse.results[x].id})** n'est pas présent sur Disney+. 😭`
                )
                .setImage(`https://i.giphy.com/media/JER2en0ZRiGUE/source.gif`)
                .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
            console.log(`• Search command use (${Type} not available on Disney+) (via Discord).`);
            message.channel.send(Search_Embed)
                .catch((error) => {
                    console.log(`○ ${error.name} : ${error.message}`);
                });
        };
    };
};