/**
 * Created by phanducviet on 5/14/16.
 */
const
    ffmpeg = require('fluent-ffmpeg'),
    request = require('request');

var file_path = 'https://www.youtube.com/watch?v=io-JPztHbhg&list=RDMMK9cyEpaCbtU&index=27';
var output_folder = '../output';
var command = ffmpeg(request.get(file_path))
    .screenshots({
        timestamps: [30.5],
        filename: 'thumbnail-at-%s-seconds.png',
        folder: output_folder,
        size: '560x292'
    })
    .on('error', function (err) {
        console.dir(err);
    })
    .on('filenames', function (filenames) {
        console.log('Will generate ' + filenames.join(', '))
    })
    .on('end', function () {
        console.log('Screenshots taken');
    });