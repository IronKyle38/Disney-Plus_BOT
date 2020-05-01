module.exports = {
    name: 'Random Short',
    description: "Send a random short to user",
    execute(TMDB_list_shorts, TMDB_api_key, http, TMDB_genres_movie, Discord, message){
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

                            id_short = data_parse_short.results[TMDB_short_random].media_type+":"+data_parse_short.results[TMDB_short_random].id

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
                                .setTitle("▶️ "+data_parse_short.results[TMDB_short_random].title+" ◀️")
                                .setURL("https://www.disneyplus.com/"+data_parse_short.comments[id_short])
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
}