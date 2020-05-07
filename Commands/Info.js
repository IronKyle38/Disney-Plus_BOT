module.exports = {
    name: 'Info',
    description: "Send list of commands to user",
    execute(Discord, message) {
        const embed_info = new Discord.MessageEmbed()
            .setColor('#01b4e4')
            .setTitle("Discord+")
            .setURL("https://github.com/IronKyle38/Discord-Plus")
            .setDescription(
                "Tu ne sais pas quoi regarder sur Disney+ ?" +
                "\nJe vais t'aider à trouver la pépite qu'il te faut !" +
                "\nTu trouveras ci-dessous les différentes commandes que tu peux utiliser."
            )
            .addFields(
                { name: "__• Pour plus d'informations :__", value: "`!info`, permet d'afficher ce message. 👀" },
                {
                    name: "__• Pour jouer avec le hasard :__", value:
                        "`!random film`, permet de découvrir un **film** au hasard." +
                        "\n`!random serie`, permet de découvrir une **série** au hasard." +
                        "\n`!random short`, permet de découvrir un **court-métrage** au hasard."
                },
                { name: "__• Pour prendre peur :__", value: "`!total`, permet de connaitre le nombre total de titres disponibles sur Disney+. 🎞️" },
                {
                    name: "__• Pour les curieux : __", value:
                        "`!bug`, permet de signaler un bug, un titre absent de Disney+ ou envoyer un commentaire (envoie via MP). 📝" +
                        "\n`!credits`, permet de découvrir qui m'a donné la vie. ❤️"
                },
            )
            .setImage("https://repository-images.githubusercontent.com/257262775/3c241580-830e-11ea-87a4-e8f6aed05f7c")
            .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");

        console.log("● Command !info use.")
        message.channel.send(embed_info)

            .catch((error) => {
                console.log("○ " + error.name + " : " + error.message)
            })
    }
}