module.exports = {
    name: 'Total',
    description: "Send the total of titles available on Disney+ FR",
    execute(HTTPS, TMDb_Movie_List_ID, TMDB_API_Key, TMDb_TV_List_ID, TMDb_Short_List_ID, TMDb_List, Discord, message) {
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

                                const Total_Embed = new Discord.MessageEmbed()
                                    .setColor('#01b4e4')
                                    .setTitle("Disney+ en chiffres :")
                                    .setURL("https://www.disneyplus.com/")
                                    .setDescription(`Il y a plus de **${data_parse_movie.total_results + data_parse_TV.total_results + data_parse_short.total_results}** titres différents à visionner sur Disney+ ! 🍿`)
                                    .addFields(
                                        { name: 'Film', value: `**${data_parse_movie.total_results}**`, inline: true },
                                        { name: 'Court-métrage', value: `**${data_parse_short.total_results}**`, inline: true },
                                        { name: 'Série', value: `**${data_parse_TV.total_results}**`, inline: true },
                                        { name: 'Saisons', value: `**${Total_Of_Seasons}**`, inline: true },
                                        { name: 'Épisodes', value: `**${Total_Of_Episodes}**`, inline: true },
                                        { name: 'Durée totale', value: `**${Days}** Jours **${Hours}** Heures **${Minutes}** Minutes ⏲️` },
                                        { name: 'Recettes des films', value: `$**${Revenue}** 💸` }
                                    )
                                    .setThumbnail("https://i.giphy.com/media/QxwnBM8MkgAdqqng5S/giphy.gif")
                                    .setImage("https://i.giphy.com/media/T9KcDBkWHrWJLF2l5Q/giphy.gif")
                                    .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
                                console.log("✅ Command !total use (via Discord).");
                                message.channel.send(Total_Embed)
                                    .catch((error) => {
                                        console.log(`❌ ${error.name} : ${error.message}`);
                                    });
                            });
                        });
                    });
                });
            });
        });
    }
};