module.exports = {
    name: 'Total',
    description: "Send the total of titles available on Disney+ FR",
    execute(TMDB_list_movies, TMDB_api_key, http, TMDB_list_TV, TMDB_list_shorts, message){
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
}