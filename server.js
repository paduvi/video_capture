/**
 * Created by phanducviet on 5/17/16.
 */
const
    express = require('express'),
    log = require('npmlog'),
    app = express();

app.use(express.static(__dirname + '/static'));

require('./api/route')(app);

app.listen(3000, function () {
    log.info("ready captain.");
});
