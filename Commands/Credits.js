module.exports = {
    name: 'Credits',
    description: "Send credits to user",
    execute(message, package){
        message.channel.send(
            ">>> Créé avec amour par **IronKyle38** 🧡"+
            "\nCodé en JavaScript avec Node.js sur Visual Studio Code"+
            "\n"+
            "\nCode source disponible sur GitHub :"+
            "\n||https://github.com/IronKyle38/Discord-Plus||"+
            "\n"+
            "\nSources des données __Chronique Disney__ et __TMDb__"+
            "\nDiscord+ utilise l'API TMDb mais n'est ni approuvé ni certifié par TMDb."+
            "\n"+
            "\nVersion : "+package.version+
            "\n© Copyright - IronKyle38 - Avril 2020"
        );
        console.log("Command !credits use.");
    }
}