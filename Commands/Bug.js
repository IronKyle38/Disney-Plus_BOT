module.exports = {
    name: 'Bug',
    description: "Send URL of BUG report form",
    execute(Discord, message) {
        const BUG_Embed = new Discord.MessageEmbed()
            .setColor('#01b4e4')
            .setTitle('Un problème ?')
            .setDescription(
                "Bonjour," +
                "\n" +
                "\nSi tu as découvert un bug, des informations erronées ou si tu souhaites m'envoyer une suggestion à propos de <@!698060675280404530> n'hésites pas ! Il te suffit juste de remplir ce [formulaire](https://forms.gle/Qo5daMfhW7EUPQck9)." +
                "\n" +
                "\nMerci pour ton aide. 💙"
            )
            .setImage('https://media1.tenor.com/images/3af1cc2e440012b9a79255b4f19190fc/tenor.gif')
            .setFooter("Discord+ uses the TMDb API but is not endorsed or certified by TMDb.", "https://i.imgur.com/tpO60XS.png");
        console.log("• Command !bug use.");
        message.author.send(BUG_Embed)
            .catch(() => {
                console.log("○ Can't send private message to user.");
                message.reply(
                    "je ne peux pas t'envoyer de messages privés. 😢" +
                    "\nMerci de vérifier tes paramètres de confidentialités afin d'autoriser les messages privés en provenance des membres du serveur. ✉️"
                )
                    .catch((error) => {
                        console.log("○ " + error.name + " : " + error.message)
                    });
            });
    }
};