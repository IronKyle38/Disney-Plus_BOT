module.exports = function Credits(Package, Tweet, Twitter_Client) {
    Reply =
        "@" + Tweet.user.screen_name +
        "\nDonnées : @ChroniqueDisney, @DisneyPlusFR et @themoviedb" +
        "\n" +
        "\Version : " + Package.version +
        "\n" +
        "\nDisney+ BOT uses the TMDb API but is not approved or certified by TMDb, nor affiliated with Disney+." +
        "\nAll trademarks referenced herein are the properties of their respective owners.";

    console.log("✅ Command credits use (via Twitter).");
    Twitter_Client.post('statuses/update', { status: Reply, in_reply_to_status_id: Tweet.id_str })
        .catch((e) => {
            console.log(`❌ ${e.errors[0].code} : ${e.errors[0].message}`);
        });
};