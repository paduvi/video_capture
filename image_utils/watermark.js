/**
 * Created by phanducviet on 5/15/16.
 */
const gm = require('gm').subClass({imageMagick: true});

var input_image = '../data/test1.png';
var button_image = '../data/button.png';

gm(input_image).size(function (err, size) {
    if (!err) {
        gm(button_image).size(function (err, button_size) {
            if (!err) {
                let x = Math.floor((size.width - button_size.width) / 2);
                let y = Math.floor((size.height - button_size.height) / 2);

                gm(input_image)
                    .composite(button_image)
                    .geometry(`+${x}+${y}`)
                    .write('../output/thumbnail1.jpg', function (err) {
                        if (!err) console.log("Written composite image.");
                    });

            }
        })
    }
});
