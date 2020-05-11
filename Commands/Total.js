module.exports = {
    name: 'Total',
    description: "Send the total of titles available on Disney+ FR",
    execute(TMDB_list_movies, TMDB_api_key, http, TMDB_list_TV, TMDB_list_shorts, Discord, message) {
        var options = {
            "method": "GET",
            "hostname": "api.themoviedb.org",
            "port": null,
            "path": "/4/list/" + TMDB_list_movies + "?api_key=" + TMDB_api_key,
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
                    "path": "/4/list/" + TMDB_list_TV + "?api_key=" + TMDB_api_key,
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
                            "path": "/4/list/" + TMDB_list_shorts + "?api_key=" + TMDB_api_key,
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

                                runtime = data_parse_movie.runtime + data_parse_TV.runtime + data_parse_short.runtime
                                days = Math.trunc(runtime / 1440)
                                hours = Math.trunc((runtime - (days * 1440)) / 60)
                                minutes = runtime - (days * 1440) - (hours * 60)

                                var str = (data_parse_movie.revenue).toLocaleString()
                                var revenue = str.replace(/,/g, " ")

                                const embed_total = new Discord.MessageEmbed()
                                    .setColor('#01b4e4')
                                    .setTitle("Disney+ en chiffres :")
                                    .setURL("https://www.disneyplus.com/")
                                    .setDescription("Il y a plus de **" + (data_parse_movie.total_results + data_parse_TV.total_results + data_parse_short.total_results) + "** titres différents à visionner sur Disney+ ! 🍿")
                                    .addFields(
                                        { name: 'Films', value: "**" + data_parse_movie.total_results + "**", inline: true },
                                        { name: 'Séries', value: "**" + data_parse_TV.total_results + "**", inline: true },
                                        { name: 'Courts-métrages', value: "**" + data_parse_short.total_results + "**", inline: true },
                                        { name: '\u200b', value: "Pour une durée totale de :" },
                                        { name: 'Jours', value: "**" + days + "**", inline: true },
                                        { name: 'Heures', value: "**" + hours + "**", inline: true },
                                        { name: 'Minutes', value: "**" + minutes + "**", inline: true },
                                        { name: '\u200b', value: "Les films présents sur Disney+ ont représenté plus de **$" + revenue + "** de recettes. 💸" },
                                    )
                                    .setThumbnail("https://i.giphy.com/media/QxwnBM8MkgAdqqng5S/giphy.gif")
                                    .setImage("https://i.giphy.com/media/T9KcDBkWHrWJLF2l5Q/giphy.gif")
                                    .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");

                                console.log("• Command !total use.")
                                message.channel.send(embed_total)

                                    .catch((error) => {
                                        console.log("○ " + error.name + " : " + error.message)
                                    })
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
}