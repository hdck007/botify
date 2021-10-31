var videoshow = require('videoshow');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const path = require('path');
const { createMeeting } = require('./merge');

// var images = ['input.jpg'];

async function createVideo(
	filename,
	image,
	index,
	filenamesArray,
	client,
	channelId
) {
	let duration = await getAudioDurationInSeconds(
		`./upload/audio/${filename}.mp3`
	);

	const images = [image];
	if (duration < 10) return;

	let videoOptions = {
		fps: 20,
		loop: duration,
		videoBitrate: 1024,
		videoCodec: 'libx264',
		size: '640x?',
		audioBitrate: '128k',
		audioChannels: 2,
		format: 'mp4',
		pixelFormat: 'yuv420p',
	};

	const audioPath = path.join(__dirname, 'upload', 'audio', `${filename}.mp3`);
	const videoPath = path.join(__dirname, 'upload', 'video', `${filename}.mp4`);

	await videoshow(images, videoOptions)
		.audio(audioPath)
		.save(videoPath)
		.on('start', function (command) {
			console.log('ffmpeg process started:', command);
		})
		.on('error', function (err, stdout, stderr) {
			if (err) {
				console.log(err.message);
				console.log('stdout:\n' + stdout);
				console.log('stderr:\n' + stderr);
			}
		})
		.on('end', function (output) {
			console.error('Video created in:', output);
			if (index === filenamesArray.length - 1) {
				console.log('Entered');
				createMeeting(filenamesArray, client, channelId);
			} else {
				const newIndex = index + 1;
				createVideo(
					filenamesArray[newIndex],
					`${__dirname}/upload/image/${filenamesArray[newIndex]}.jpg`,
					newIndex,
					filenamesArray,
					client,
					channelId
				);
			}
		});
}

module.exports = {
	createVideo,
};
