/* by Kindacode.com */
const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const downloadFile = async (fileUrl, filename) => {
	// The path of the downloaded file on our machine
	const localFilePath = path.resolve(
		`${__dirname}/upload/image/${filename}.jpg`
	);
	try {
		const response = await axios({
			method: 'GET',
			url: fileUrl,
			responseType: 'stream',
		});

		const w = response.data.pipe(fs.createWriteStream(localFilePath));
		w.on('finish', () => {
			console.log('Successfully downloaded file!');
		});
	} catch (err) {
		throw new Error(err);
	}
};

module.exports = {
	downloadFile,
};
