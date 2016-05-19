/**
 * Created by phanducviet on 5/17/16.
 */
const
    action = require('./action.js'),
    formidable = require('formidable'),
    filestore = require('fs-extra'),
    fs = require('fs'),
    path = require('path'),
    baseDir = path.join(__dirname, '..');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('./static/index.html');
    });

    app.post('/upload', function (req, res) {
        var fmr = new formidable.IncomingForm();
        fmr.parse(req, function (err, fields, files) {
            if (err) res.json(err.toString());

            action.upload(files.upload.path, baseDir + '/static/upload/' + files.upload.name)
                .then(function () {
                    var fileExtension = files.upload.name.split('.').pop();
                    res.json({
                        path: '/upload/' + files.upload.name,
                        type: fileExtension
                    });
                })
                .catch(function (err) {
                    throw err;
                });

        });
    });

    app.get('/capture', function (req, res) {
        var time = req.query.time;
        console.log(req.query.videoPath);
        var videoPath = baseDir + '/static' + decodeURIComponent(req.query.videoPath);
        action.capture(videoPath, baseDir + '/static/capture', time)
            .then(function (imageName) {
                res.send(imageName);
            })
            .catch(function (err) {
                throw err;
            })
    });

    app.put('/create-watermark/:name', function (req, res) {
        var file_name = req.params.name;
        var w = fs.createWriteStream(baseDir + '/data/temp/' + file_name);
        req.pipe(w);
        w.on('error', function (err) {
            res.status(500).json(err);
        });
        w.on('finish', function () {
            action.watermark(baseDir + '/data/temp/' + file_name, baseDir + '/static/watermark/' + file_name)
                .then(function () {
                    res.status(200).send("/watermark/" + file_name);
                })
                .catch(function (err) {
                    res.status(500).json(err);
                });
        });
    })
};