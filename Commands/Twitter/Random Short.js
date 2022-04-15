module.exports = function Random_Film(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client, Tweet) {
    TMDB_Short_Random = Math.floor(Math.random() * TMDb_List.Short.length);

    HTTPS.get(`https://api.themoviedb.org/3/movie/${TMDb_List.Short[TMDB_Short_Random].ID}?api_key=${TMDB_API_Key}&language=fr-FR&append_to_response=credits,translations`, (req) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            data_parse = JSON.parse(data);

            URL = `https://www.disneyplus.com/${TMDb_List.Short[TMDB_Short_Random].URL}`;

            var Note = ""
            if (data_parse.vote_average < 1) {
                Note = "Note indisponible";
            } else {
                Note += "❤️".repeat(Math.round(data_parse.vote_average));
                Note += "🤍".repeat(10 - Math.round(data_parse.vote_average));
            };

            Reply = `@${Tweet.user.screen_name}▶ ${data_parse.title} ◀\n\nNote (${data_parse.vote_count} notes)\n${Note}\n${URL}`;

            console.log("✅ Command random short use (via Twitter).");
            Twitter_Client.post('statuses/update', { status: Reply, in_reply_to_status_id: Tweet.id_str })
                .catch((e) => {
                    console.log(`❌ ${e.errors[0].code} : ${e.errors[0].message}`);
                });
        });
    });
};