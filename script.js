var videoshow = require('videoshow');
const { getAudioDurationInSeconds } = require('get-audio-duration');

var images = ['input.jpg'];

getAudioDurationInSeconds('song.mp3').then((result) => {
	var videoOptions = {
		fps: 25,
		loop: result,
		videoBitrate: 1024,
		videoCodec: 'libx264',
		size: '640x?',
		audioBitrate: '128k',
		audioChannels: 2,
		format: 'mp4',
		pixelFormat: 'yuv420p',
	};

	videoshow(images, videoOptions)
		.audio('./song.mp3')
		.save('./video.mp4')
		.on('start', function (command) {
			console.log('ffmpeg process started:', command);
		})
		.on('error', function (err, stdout, stderr) {
			console.error('Error:', err);
			console.error('ffmpeg stderr:', stderr);
		})
		.on('end', function (output) {
			console.error('Video created in:', output);
		});
});
