const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
    });

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;
        return conversationId;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

app.event("message", async ({ event, client }) => {
  let conversationHistory;

  console.log(event);
  // ID of channel you watch to fetch the history for
  let channelId = await findConversation("general");

  try {
    // Call the conversations.history method using WebClient
    const result = await client.conversations.history({
      channel: channelId,
    });

    conversationHistory = result.messages;

    // Print results
    // console.log(conversationHistory);
    console.log(conversationHistory);

    if (event.text === "end") {
      let value = true;
      let filtered = conversationHistory.filter((element) => {
        if (element.text === "start") {
          value = false;
        }
        return value;
      });
      filtered.reverse();

      let message = "";
      filtered.forEach((element) => (message += String(element.text)));

      console.log(message);
    }
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
