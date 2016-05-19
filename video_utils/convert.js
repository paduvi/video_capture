/**
 * Created by phanducviet on 5/14/16.
 */
const
    ffmpeg = require('fluent-ffmpeg');

var file_path = '../data/test.mp4';
var command = ffmpeg()
    .input(file_path)
    .videoCodec("libx264")
    .format('mp4');

command
    .on('start', function () {
        console.log('Will compress ' + file_path);
    })
    .on('end', function () {
        console.log('Done');
    })
    .saveToFile('../output/test.mp4');