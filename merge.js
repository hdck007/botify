const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
var fluent_ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

function createMeeting(filenames, client, channelId) {
	let mergedVideo = fluent_ffmpeg();

	console.log(filenames);

	filenames.forEach((filename) => {
		const videoPath = path.join(
			__dirname,
			'upload',
			'video',
			`${filename}.mp4`
		);
		mergedVideo = mergedVideo.addInput(videoPath);
	});

	const resultFilename = uuidv4();

	mergedVideo
		.mergeToFile(`${resultFilename}.mp4`, './tmp/')
		.on('error', function (err) {
			console.log('Error ' + err.message);
		})
		.on('end', async function () {
			const fileName = `${resultFilename}.mp4`;

			try {
				const result = await client.files.upload({
					channels: channelId,
					initial_comment: 'The meeting',
					file: fs.createReadStream(fileName),
				});

				console.log(result);
			} catch (error) {
				console.error(error);
			}
			console.log('finished');
		});
}

module.exports = {
	createMeeting,
};
