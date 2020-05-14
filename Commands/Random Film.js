module.exports = {
    name: 'Random Film',
    description: "Send random film to user",
    execute(TMDb_List, HTTPS, TMDB_API_Key, Google_Form_URL, Discord, message) {
        TMDB_Movie_Random = Math.floor(Math.random() * TMDb_List.Movie.length);

        HTTPS.get(`https://api.themoviedb.org/3/movie/${TMDb_List.Movie[TMDB_Movie_Random].ID}?api_key=${TMDB_API_Key}&language=fr-FR&append_to_response=credits,translations`, (req) => {
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
                Crew = data_parse.credits.crew.filter(a => a.job == "Director")
                if (Crew[0] == undefined) {
                    Director = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    for (let i = 0; i < Crew.length; i++) {
                        Director += Crew[i].name + '\n';
                    };
                };

                if (data_parse.runtime == 0) {
                    Runtime = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    Hours = Math.trunc(data_parse.runtime / 60);
                    Minutes = data_parse.runtime - (Hours * 60);
                    if (Hours == 0) {
                        Runtime = `${Minutes} min`;
                    } else {
                        Runtime = `${Hours} h ${Minutes} min`;
                    };
                };

                Release_Date = data_parse.release_date.split("-");

                var Cast = ""
                if (data_parse.credits.cast.length == 0) {
                    Cast = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
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
                    Genre = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    for (let i = 0; i < data_parse.genres.length; i++) {
                        Genre += data_parse.genres[i].name + '\n';
                    };
                };

                var Country = ""
                if (data_parse.production_countries.length == 0) {
                    Country = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    for (let i = 0; i < data_parse.production_countries.length; i++) {
                        Country += `:flag_${data_parse.production_countries[i].iso_3166_1.toLowerCase()}: `;
                    };
                };

                if (data_parse.budget == 0) {
                    Budget = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    Budget = `$${data_parse.budget.toLocaleString().replace(/,/g, " ")}`;
                };

                if (data_parse.revenue == 0) {
                    Revenue = `[-](${Google_Form_URL}!random+film&entry.1530119858=${encodeURI(data_parse.title)})`;
                } else {
                    Revenue = `$${data_parse.revenue.toLocaleString().replace(/,/g, " ")}`;
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
                    .setTitle(`\`▶ ${data_parse.title} ◀\``)
                    .setURL(`https://www.disneyplus.com/${TMDb_List.Movie[TMDB_Movie_Random].URL}`)
                    .setDescription(Overview)
                    .addFields(
                        { name: 'Réalisé par', value: Director, inline: true },
                        { name: 'Durée', value: Runtime, inline: true },
                        { name: 'Date de sortie', value: Release_Date[0], inline: true },
                        { name: 'Avec', value: Cast, inline: true },
                        { name: 'Genre', value: Genre, inline: true },
                        { name: "Pays d'origine", value: Country, inline: true },
                        { name: 'Budget', value: Budget, inline: true },
                        { name: 'Recette', value: Revenue, inline: true },
                        { name: `Note (${data_parse.vote_count} notes)`, value: Note }
                    )
                    .setThumbnail(`https://image.tmdb.org/t/p/original${data_parse.poster_path}`)
                    .setImage(`https://image.tmdb.org/t/p/original${data_parse.backdrop_path}`)
                    .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                console.log("• Command !random film use.");
                message.channel.send(Movie_Embed)
                    .catch((error) => {
                        console.log("○ " + error.name + " : " + error.message);
                    });
            });
        });
    }
};