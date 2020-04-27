module.exports = {
    name: 'Random Serie',
    description: "Send a random serie to user",
    execute(TMDB_list_TV, TMDB_api_key, http, TMDB_genres_TV, Discord, message){
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
}