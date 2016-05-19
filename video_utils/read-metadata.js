/**
 * Created by phanducviet on 5/14/16.
 */
const
    ffmpeg = require('fluent-ffmpeg');

var file_path = '../output/test.mp4';
// var file_path = '../data/test.mp4';

ffmpeg(file_path)
    .ffprobe(function (err, data) {
        console.log('video codec:', data.streams[0].codec_name);
        console.log('size:', data.format.size)
    });
