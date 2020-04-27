module.exports = {
    name: 'Bug',
    description: "Send URL of BUG report form",
    execute(message){
        console.log("Command !bug use.")
        message.author.send(
            "Bonjour,"+
            "\nSi tu as découvert un bug ou si tu souhaites m'envoyer une suggestion n'hésites pas !"+
            "\nRemplis juste ce formulaire : https://docs.google.com/forms/d/e/1FAIpQLScr50E0Kxuw9YHc3mHfTlFaNbPSAUD9ZKmHK_UVKIldYl809w/viewform"+
            "\nMerci pour ton aide. :heart:"
        )
        .catch(() => {
            message.reply(
                "je ne peux pas t'envoyer de messages privés. 😢"+
                "\nMerci de vérifier tes paramètres de confidentialités afin d'autoriser les messages privés en provenance des membres du serveur. ✉️"
            )
            console.log("Can't send private messages to user.")
        })
    }
}