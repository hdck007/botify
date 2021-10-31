const axios = require('axios');
const fs = require('fs');

async function convert(filename, text) {
	await axios
		.get('http://api.voicerss.org/', {
			params: {
				key: 'c926c44360674c17acd13c1a12ac5111',
				hl: 'en-us',
				src: text,
			},
			responseType: 'stream',
		})
		.then(function (response) {
			response.data.pipe(
				fs.createWriteStream(`${__dirname}/upload/audio/${filename}.mp3`)
			);
		});
}

module.exports = {
	convert,
};
