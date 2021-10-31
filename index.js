('use strict');
const { App } = require('@slack/bolt');
require('dotenv').config();
const { convert } = require('./convert');
const { v4: uuidv4 } = require('uuid');
const { createVideo } = require('./script');
const { downloadFile } = require('./download');

const app = new App({
	token: process.env.SLACK_BOT_TOKEN,
	signingSecret: process.env.SLACK_SIGNING_SECRET,
	socketMode: true,
	appToken: process.env.SLACK_APP_TOKEN,
});

async function findConversation(name) {
	try {
		const result = await app.client.conversations.list({
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

app.command('/start', async ({ command, ack, say }) => {
	try {
		await ack();
		say('The meeting is started');
	} catch (error) {
		console.log('err');
		console.error(error);
	}
});

app.command('/end', async ({ command, ack, say, client }) => {
	try {
		await ack();
		let conversationHistory;
		const channelId = await findConversation('harry');

		const result = await client.conversations.history({
			channel: channelId,
		});

		conversationHistory = result.messages;

		let value = true;
		let filtered = conversationHistory.filter((element) => {
			if (element.text === 'The meeting is started') {
				value = false;
			}
			return value;
		});
		filtered.reverse();

		let filenames = [];

		for (let i = 0; i < filtered.length; i++) {
			let filename = uuidv4();
			filenames.push(filename);
			await convert(filename, filtered[i].text);
		}

		for (let i = 0; i < filenames.length; i++) {
			try {
				// Call the users.info method using the WebClient
				const username = await client.users.info({
					user: filtered[i].user,
				});

				// console.log(username)

				await downloadFile(
					`https://ui-avatars.com/api/?name=${username.user.real_name}&size=512`,
					filenames[i]
				);
			} catch (error) {
				console.error(error);
			}
		}

		let images = filenames.map(
			(element) => `${__dirname}/upload/image/${element}.jpg`
		);

		await createVideo(filenames[0], images[0], 0, filenames, client, channelId);
	} catch (error) {
		console.log('err');
		console.error(error);
	}
});

(async () => {
	await app.start(process.env.PORT || 3000);
	console.log('⚡️ Bolt app is running!');
})();
