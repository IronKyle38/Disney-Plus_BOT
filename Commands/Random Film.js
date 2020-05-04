module.exports = {
    name: 'Random Film',
    description: "Send random film to user",
    execute(TMDB_list_movies, TMDB_api_key, http, TMDB_genres_movie, Discord, message){
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

                            id_movie = data_parse_movie.results[TMDB_movie_random].media_type+":"+data_parse_movie.results[TMDB_movie_random].id

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
                                .setTitle("▶️ "+data_parse_movie.results[TMDB_movie_random].title+" ◀️")
                                .setURL("https://www.disneyplus.com/"+data_parse_movie.comments[id_movie])
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
}