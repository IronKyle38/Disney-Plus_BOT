module.exports = {
    name: 'Info',
    description: "Send list of commands to user",
    execute(Discord, message){
        const embed_info = new Discord.MessageEmbed()
            .setColor('#01b4e4')
            .setTitle("Discord+")
            .setURL("https://github.com/IronKyle38/Discord-Plus")
            .setDescription(
                "Tu ne sais pas quoi regarder sur Disney+ ?"+
                "\nJe vais t'aider à trouver la pépite qu'il te faut !"+
                "\nTu trouveras ci-dessous les différentes commandes que tu peux utiliser."
            )
            .addFields(
                { name: '`!info`', value: "Permet d'afficher ce message. 👀" },
                { name: '`!random film`', value: "Permet de découvrir un **film** au hasard." },
                { name: '`!random serie`', value: "Permet de découvrir une **série** au hasard." },
                { name: '`!random short`', value: "Permet de découvrir un **court-métrage** au hasard." },
                { name: '`!total`', value: "Permet de connaitre le nombre total de titres disponibles sur Disney+. 🎞️" },
                { name: '`!bug`', value: "Permet de signaler un bug, un titre absent de Disney+ ou envoyer un commentaire (envoie via MP). 📝" },
                { name: '`!credits`', value: "Permet de découvrir qui m'a donné la vie. ❤️" },
            )
            .setImage("https://repository-images.githubusercontent.com/257262775/3c241580-830e-11ea-87a4-e8f6aed05f7c")
            .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");

        message.channel.send(embed_info);
        console.log("Command !info use.");
    }
}