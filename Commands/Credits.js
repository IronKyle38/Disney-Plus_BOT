module.exports = {
    name: 'Credits',
    description: "Send credits to user",
    execute(Discord, Package, message) {
        const Credits_Embed = new Discord.MessageEmbed()
            .setColor('#01b4e4')
            .setTitle('Credits')
            .setDescription('Créé avec amour par [IronKyle38](https://www.twitter.com/IronKyle38) 💙')
            .addFields(
                { name: 'Langage', value: '[JavaScript](https://developer.mozilla.org/fr/JavaScript)\n[Node.js](https://nodejs.org/)', inline: true },
                { name: 'Package', value: '[Discord.js](https://discord.js.org/)', inline: true },
                { name: 'Logiciel', value: '[Visual Studio Code](https://code.visualstudio.com/)', inline: true },
                { name: 'Sources des données', value: '[Chronique Disney](https://www.chroniquedisney.fr/programme/catalogue-disneyplus.php) et [TMDb](https://www.themoviedb.org)' },
                { name: 'Code source', value: 'Disponible sur [GitHub](https://github.com/IronKyle38/Disney-Plus-BOT)', inline: true },
                { name: 'Version', value: Package.version, inline: true },
                {
                    name: "Droits d'auteur", value:
                        "This BOT is not affiliated with Disney+.\n" +
                        "All trademarks referenced herein are the properties of their respective owners.\n" +
                        "©2020 The Walt Disney Company. All rights reserved."
                }
            )
            .setImage('https://repository-images.githubusercontent.com/257262775/14c3e980-9e74-11ea-8ad6-52c35c8e9ca0')
            .setFooter("Disney+ BOT uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
        console.log("• Command !credits use.");
        message.channel.send(Credits_Embed)
            .catch((error) => {
                console.log("○ " + error.name + " : " + error.message);
            });
    }
};