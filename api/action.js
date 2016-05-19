/**
 * Created by phanducviet on 5/17/16.
 */
const
    ffmpeg = require('fluent-ffmpeg'),
    Promise = require('bluebird'),
    request = require('request'),
    fs = require('fs'),
    gm = require('gm').subClass({imageMagick: true}),
    path = require('path'),
    baseDir = path.join(__dirname, '..');

var exports = module.exports = {};

exports.upload = function (src_file, des_file) {
    return new Promise(function (resolve, reject) {

        var command = ffmpeg()
            .input(src_file)
            .videoCodec("libx264")
            .format('mp4');

        command
            .on('start', function () {
                console.log('Will compress ' + src_file);
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                console.log(`Compress done! Saved to ${des_file}`);
                resolve();
            })
            .saveToFile(des_file);
    });
};

exports.capture = function (video_path, output_folder, time) {
    return new Promise(function (resolve, reject) {
        var output_file;
        console.log("Capture screenshots from " + video_path);
        ffmpeg(video_path)
            .screenshots({
                timestamps: [time],
                filename: 'thumbnail-at-%s-seconds.png',
                folder: output_folder,
                size: '560x292'
            })
            .on('filenames', function (filenames) {
                output_file = filenames[0];
                console.log('Will generate ' + filenames[0]);
            })
            .on('error', function (err) {
                reject(err);
            })
            .on('end', function () {
                console.log('Screenshots taken at ' + output_file);
                fs.createReadStream(output_folder + "/" + output_file)
                    .on('error', function (err) {
                        reject(err);
                    })
                    .on('end', function () {
                        fs.unlink(output_folder + "/" + output_file, function (err) {
                        });
                    })
                    .pipe(request.put("http://localhost:3000/create-watermark/" + output_file, function (err, res, body) {
                        if (err)
                            return reject(err);
                        if (res.statusCode == 200) {
                            return resolve(body);
                        }
                        console.log(body);
                        reject(body);
                    }));

            });
    });
};

exports.watermark = function (image_path, output_path) {
    return new Promise(function (resolve, reject) {
        console.log("Prepare watermark...");
        var button_image = baseDir + '/data/button.png';
        gm(image_path).size(function (err, size) {
            if (err) {
                reject(err);
            }
            if (!size || size == undefined) {
                reject(new Error("khong co loi nhung thuc ra co loi day"));
            }
            gm(button_image).size(function (err, button_size) {
                if (err) {
                    reject(err);
                }

                if (!button_size || button_size == undefined) {
                    reject(new Error("khong co loi nhung thuc ra co loi day"));
                }
                let x = Math.floor((size.width - button_size.width) / 2);
                let y = Math.floor((size.height - button_size.height) / 2);

                new Promise(function (res, rej) {
                    gm(image_path)
                        .composite(button_image)
                        .geometry(`+${x}+${y}`)
                        .write(output_path, function (err) {
                            if (err)
                                rej(err);
                            res();
                        })
                }).then(function () {
                    fs.unlink(image_path);
                    console.log("Watermark done...");
                    resolve();
                }).catch(function (err) {
                    fs.unlink(image_path);
                    reject(err);
                });

            })
        });
    });
}