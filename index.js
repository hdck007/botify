const { App } = require('@slack/bolt');
const { default: axios } = require('@slack/web-api/node_modules/axios');
require('dotenv').config();

('use strict');

const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');

async function downloadImage() {
	// const url = ''
	const path = Path.resolve(__dirname, 'media', 'result.mp4');
	const writer = Fs.createWriteStream(path);
	let tokenStr =
		'xoxp-2644685501556-2645381099507-2662915222421-c2dbcec948924db92c610ad2aa227ca0';
	let webApiUrl =
		'https://files.slack.com/files-pri/T02JYL5ERGC-F02KYNU5PEV/download/vid_20200309154952.mp4';

	const instance = axios.create({
		baseURL: 'https://files.slack.com/',
		timeout: 1000,
		headers: { Authorization: `Bearer ${tokenStr}` },
	});

	const response = await instance.get(
		'files-tmb/T02JYL5ERGC-F02KFQV0GG5-e7f57e3993/slack_video_1635516568177.mp4'
	);

	console.log(response)

	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
}

downloadImage();

let tokenStr =
	'xoxp-2644685501556-2645381099507-2662915222421-c2dbcec948924db92c610ad2aa227ca0';

let webApiUrl =
	'https://files.slack.com/files-tmb/T02JYL5ERGC-F02KFQV0GG5-e7f57e3993/slack_video_1635516568177.mp4';
// let webApiUrl =
// 	'https://test-purposegroup.slack.com/files/U02JZB72XEX/F02KYM7A3U1/2021-09-17_00-38-04.mkv';

// axios
// 	.get(webApiUrl, { headers: { 'Authorization': `Bearer ${tokenStr}` } })
// 	.then((result) => console.log(result));

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

		const answer = await app.client.files.sharedPublicURL(
			process.env.SLACK_BOT_TOKEN,
			'F02KFQV0GG5'
		);

		console.log(answer);

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

app.event('message', async ({ event, client }) => {
	let conversationHistory;

	console.log(event);
	let channelId = await findConversation('harry');

	try {
		const result = await client.conversations.history({
			channel: channelId,
		});

		conversationHistory = result.messages;

		if (event.text === 'end') {
			let value = true;
			let filtered = conversationHistory.filter((element) => {
				if (element.text === 'start') {
					value = false;
				}
				return value;
			});
			filtered.reverse();

			let message = '';
			filtered.forEach((element) => (message += String(element.text)));

			console.log(message);
		}
	} catch (error) {
		console.error(error);
	}
});

(async () => {
	await app.start(process.env.PORT || 3000);
	console.log('⚡️ Bolt app is running!');
})();
