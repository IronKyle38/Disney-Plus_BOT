module.exports = function Bug(Tweet, Twitter_Client) {
    Reply =
        "Bonjour @" + Tweet.user.screen_name + "," +
        "\n" +
        "\nSi tu as découvert un bug, des informations erronées ou si tu souhaites m'envoyer une suggestion n'hésites pas !" +
        "\nIl te suffit juste de remplir ce formulaire : https://forms.gle/Qo5daMfhW7EUPQck9 ou de m'envoyer un MP." +
        "\n" +
        "\nMerci pour ton aide. 💙";

    DM_URL = "https://twitter.com/messages/compose?recipient_id=1264823416978386944";

    console.log("✅ Command bug use (via Twitter).");
    Twitter_Client.post('statuses/update', { status: Reply, in_reply_to_status_id: Tweet.id_str, attachment_url: DM_URL })
        .catch((e) => {
            console.log(`❌ ${e.errors[0].code} : ${e.errors[0].message}`);
        });
};