module.exports = function Total(HTTPS, TMDb_Movie_List_ID, TMDB_API_Key, TMDb_TV_List_ID, TMDb_Short_List_ID, TMDb_List, Twitter_Client, Tweet) {
    HTTPS.get(`https://api.themoviedb.org/4/list/${TMDb_Movie_List_ID}?api_key=${TMDB_API_Key}`, (req) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            data_parse_movie = JSON.parse(data);

            HTTPS.get(`https://api.themoviedb.org/4/list/${TMDb_TV_List_ID}?api_key=${TMDB_API_Key}`, (req) => {
                let data = '';

                req.on('data', (chunk) => {
                    data += chunk;
                });

                req.on('end', () => {
                    data_parse_TV = JSON.parse(data);

                    HTTPS.get(`https://api.themoviedb.org/4/list/${TMDb_Short_List_ID}?api_key=${TMDB_API_Key}`, (req) => {
                        let data = '';

                        req.on('data', (chunk) => {
                            data += chunk;
                        });

                        req.on('end', () => {
                            data_parse_short = JSON.parse(data);

                            Total_Titles = data_parse_movie.total_results + data_parse_TV.total_results + data_parse_short.total_results

                            var Total_Of_Seasons = 0;
                            for (let i = 0; i < TMDb_List.TV.length; i++) {
                                Total_Of_Seasons += TMDb_List.TV[i].Number_Of_Seasons;
                            };

                            var Total_Of_Episodes = 0;
                            for (let j = 0; j < TMDb_List.TV.length; j++) {
                                Total_Of_Episodes += TMDb_List.TV[j].Number_Of_Episodes;
                            };

                            Runtime = data_parse_movie.runtime + data_parse_TV.runtime + data_parse_short.runtime;
                            Days = Math.trunc(Runtime / 1440);
                            Hours = Math.trunc((Runtime - (Days * 1440)) / 60);
                            Minutes = Runtime - (Days * 1440) - (Hours * 60);

                            Revenue = (data_parse_movie.revenue).toLocaleString().replace(/,/g, " ");

                            Reply =
                                "@" + Tweet.user.screen_name +
                                "\nIl y a plus de " + Total_Titles + " titres différents à visionner sur Disney+ ! 🍿" +
                                "\n" +
                                "\n" + data_parse_movie.total_results + " Films et " + data_parse_short.total_results + " Court-métrage" +
                                "\n" + data_parse_TV.total_results + " Séries dont " + Total_Of_Seasons + " saisons et " + Total_Of_Episodes + " épisodes." +
                                "\n" +
                                "\nDurée totale :" +
                                "\n" + Days + " Jours " + Hours + " Heures " + Minutes + " Minutes ⏲️" +
                                "\n" +
                                "\nRecettes des films :" +
                                "\n$" + Revenue + " 💸";

                            console.log("• Command total use (via Twitter).");
                            Twitter_Client.post('statuses/update', { status: Reply, in_reply_to_status_id: Tweet.id_str })
                                .catch((e) => {
                                    console.log(`○ ${e.errors[0].code} : ${e.errors[0].message}`);
                                });
                        });
                    });
                });
            });
        });
    });
};