module.exports = {
    name: 'Random Serie',
    description: "Send a random serie to user",
    execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message) {
        TMDB_TV_Random = Math.floor(Math.random() * TMDb_List.TV.length);

        HTTPS.get(`https://api.themoviedb.org/3/tv/${TMDb_List.TV[TMDB_TV_Random].ID}?api_key=${TMDB_API_Key}&language=fr-FR&append_to_response=credits,translations`, (req) => {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', () => {
                data_parse = JSON.parse(data);

                if (data_parse.overview == "") {
                    Overview = data_parse.translations.translations.filter(a => a.name == "English")[0].data.overview;
                } else {
                    Overview = data_parse.overview
                };

                var Director = ""
                if (data_parse.created_by[0] == undefined) {
                    Director = `[-](${Google_Form_URL}!random+serie&entry.1530119858=${encodeURI(data_parse.name)})`;
                } else {
                    for (let i = 0; i < data_parse.created_by.length; i++) {
                        Director += data_parse.created_by[i].name + '\n';
                    };
                };

                if (data_parse.episode_run_time[0] == undefined) {
                    Runtime = `[-](${Google_Form_URL}!random+serie&entry.1530119858=${encodeURI(data_parse.name)})`;
                } else {
                    Hours = Math.trunc(data_parse.episode_run_time[0] / 60);
                    Minutes = data_parse.episode_run_time[0] - (Hours * 60);
                    if (Hours == 0) {
                        Runtime = `${Minutes} min`;
                    } else {
                        Runtime = `${Hours} h ${Minutes} min`;
                    };
                };

                First_Air_Date = data_parse.first_air_date.split("-");

                var Cast = ""
                if (data_parse.credits.cast.length == 0) {
                    Cast = `[-](${Google_Form_URL}!random+serie&entry.1530119858=${encodeURI(data_parse.name)})`;
                } else {
                    if (data_parse.credits.cast.length >= 5) {
                        max = 5;
                    } else {
                        max = data_parse.credits.cast.length;
                    } for (let i = 0; i < max; i++) {
                        Cast += data_parse.credits.cast[i].name + '\n';
                    };
                };

                var Genre = ""
                if (data_parse.genres.length == 0) {
                    Genre = `[-](${Google_Form_URL}!random+serie&entry.1530119858=${encodeURI(data_parse.name)})`;
                } else {
                    for (let i = 0; i < data_parse.genres.length; i++) {
                        Genre += data_parse.genres[i].name + '\n';
                    };
                };

                var Country = ""
                if (data_parse.origin_country.length == 0) {
                    Country = `[-](${Google_Form_URL}!random+serie&entry.1530119858=${encodeURI(data_parse.name)})`;
                } else {
                    for (let i = 0; i < data_parse.origin_country.length; i++) {
                        Country += `:flag_${data_parse.origin_country[i].toLowerCase()}: `;
                    };
                };

                var Special_Season = ""
                if (TMDb_List.TV[TMDB_TV_Random].Special != null) {
                    Special_Season = `[**OUI**](https://www.disneyplus.com/${TMDb_List.TV[TMDB_TV_Random].Special})`;
                } else {
                    Special_Season = "NON";
                };

                var Note = ""
                if (data_parse.vote_average < 1) {
                    Note = "Note indisponible";
                } else {
                    Note += "❤️".repeat(Math.round(data_parse.vote_average));
                    Note += "🤍".repeat(10 - Math.round(data_parse.vote_average));
                };

                const Movie_Embed = new Discord.MessageEmbed()
                    .setColor('#01b4e4')
                    .setTitle(`▶ ${data_parse.name} ◀`)
                    .setURL(`https://www.disneyplus.com/${TMDb_List.TV[TMDB_TV_Random].URL}`)
                    .setDescription(Overview)
                    .addFields(
                        { name: 'Réalisé par', value: Director, inline: true },
                        { name: 'Durée', value: Runtime, inline: true },
                        { name: 'Première diffusion', value: First_Air_Date[0], inline: true },
                        { name: 'Avec', value: Cast, inline: true },
                        { name: 'Genre', value: Genre, inline: true },
                        { name: "Pays d'origine", value: Country, inline: true },
                        { name: 'Saisons', value: TMDb_List.TV[TMDB_TV_Random].Number_Of_Seasons, inline: true },
                        { name: 'Épisodes', value: TMDb_List.TV[TMDB_TV_Random].Number_Of_Episodes, inline: true },
                        { name: 'Saisons spéciales', value: Special_Season, inline: true },
                        { name: `Note (${data_parse.vote_count} notes)`, value: `[${Note}](https://www.themoviedb.org/tv/${TMDb_List.TV[TMDB_TV_Random].ID})` }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/original${data_parse.poster_path}`)
                    .setImage(`https://image.tmdb.org/t/p/original${data_parse.backdrop_path}`)
                    .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                console.log("• Command !random serie use (via Discord).");
                message.channel.send(Movie_Embed)
                    .catch((error) => {
                        console.log(`○ ${error.name} : ${error.message}`);
                    });
            });
        });
    }
};