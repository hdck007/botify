var videoshow = require('videoshow')
 
var images = [
  'input.jpg',
]
 
var videoOptions = {
  fps: 25,
  loop: 5,
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}
 
videoshow(images, videoOptions)
  .audio('./song2.mp3')
  .save('./video2.mp4')
  .on('start', function (command) {
    console.log('ffmpeg process started:', command)
  })
  .on('error', function (err, stdout, stderr) {
    console.error('Error:', err)
    console.error('ffmpeg stderr:', stderr)
  })
  .on('end', function (output) {
    console.error('Video created in:', output)
  })