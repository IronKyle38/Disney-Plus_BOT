module.exports = {
    name: 'Old Command',
    description: "Send a warn when someone want to use an old command",
    execute(message) {
        console.log("• Old command use.");
        message.reply(
            "\nCette commande n'est plus diponible." +
            "\nUtilise à la place `!random film`, `!random serie` ou `!random short`." +
            "\nToutes les commandes disponibles sont accessibles en tapant `!info`."
        )
            .catch((error) => {
                console.log("○ " + error.name + " : " + error.message)
            });
    }
};