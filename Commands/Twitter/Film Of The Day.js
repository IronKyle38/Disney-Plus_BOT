module.exports = function Film_Of_The_Day(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client) {
    var Today = new Date();
    var Tweet_Day = new Date(
        Today.getFullYear(),
        Today.getMonth(),
        Today.getDate(),
        10
    );

    if (Today.getHours() >= 10) {
        Tweet_Day.setDate(Today.getDate() + 1);
    };

    console.log("• Film of the day planned for:" + Tweet_Day);

    var ms_To_Tweet_Day = Tweet_Day.getTime() - Today.getTime();

    setTimeout(function () {
        TMDB_Movie_Random = Math.floor(Math.random() * TMDb_List.Movie.length);

        HTTPS.get(`https://api.themoviedb.org/3/movie/${TMDb_List.Movie[TMDB_Movie_Random].ID}?api_key=${TMDB_API_Key}&language=fr-FR&append_to_response=credits,translations`, (req) => {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', () => {
                data_parse = JSON.parse(data);
                Character_Counter = 280 - 39 - data_parse.title.length;

                if (data_parse.overview == "") {
                    Overview = data_parse.translations.translations.filter(a => a.name == "English")[0].data.overview;
                    Overview = twitter(Overview, Character_Counter);
                } else {
                    Overview = data_parse.overview;
                    Overview = twitter(Overview, Character_Counter);
                };

                URL = `https://www.disneyplus.com/fr-fr/${TMDb_List.Movie[TMDB_Movie_Random].URL}`;

                Reply =
                    "Film du jour" +
                    "\n" + data_parse.title +
                    "\n" +
                    "\n" + Overview +
                    "\n" + URL;

                console.log("• Tweet Film of the day send (via Twitter).");
                Twitter_Client.post('statuses/update', { status: Reply })
                    .catch((e) => {
                        console.log(`○ ${e.errors[0].code} : ${e.errors[0].message}`);
                    });

                Film_Of_The_Day(TMDb_List, HTTPS, TMDB_API_Key, Twitter_Client);
            });
        });
    }, ms_To_Tweet_Day);
};

function twitter(str, Character_Counter) {
    str = str.slice(0, (Character_Counter - 3));
    str += "...";
    return str;
};