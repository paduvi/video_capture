/**
 * Created by phanducviet on 5/17/16.
 */
var base_url = window.location.origin;

$("document").ready(function () {

    $("#upload").change(function () {
        $("#file-name").val($("#upload").val().replace(/\\/g, '/').replace(/.*\//, ''));
        var player = document.getElementById('videoPlayer');
        player.poster = "spinner.gif";
        $.ajax({
            url: 'http://localhost:3000/upload/',
            type: 'POST',
            data: new FormData($('#my-form')[0]),
            processData: false,
            contentType: false,
        })
            .done(function (file) {
                switch (file.type) {
                    case "mp4":
                        source = document.getElementById('mp4Source');
                        break;
                    case "ogg":
                        source = document.getElementById('oggSource');
                        break;
                    case "webm":
                        source = document.getElementById('webmSource');
                        break;
                    default:
                        player.poster = "no-video.png";
                        alert("error upload");
                        return;
                }

                $.get("http://localhost:3000/capture", {
                    time: 0,
                    videoPath: encodeURIComponent(file.path)
                })
                    .done(function (imagePath) {
                        player.poster = imagePath;
                        insert(imagePath);
                    })
                    .fail(function (err) {
                        player.poster = "error.png";
                    })
                    .always(function () {
                        source.src = file.path;
                        player.load();
                        player.play();

                        $("#capture").css("display", "block");
                    });
            })
            .fail(function () {
                alert("error upload");
                player.poster = "no-video.png";
            });
    });

    $("#capture").click(function () {
        var player = document.getElementById('videoPlayer');
        var currentTime = player.currentTime;
        var videoPath = player.currentSrc.replace(base_url, '');
        $.get("http://localhost:3000/capture", {time: currentTime, videoPath: videoPath})
            .done(function (imagePath) {
                insert(imagePath);
            })
            .fail(function (err) {
                alert("error capture");
            });
    });

    var insert = function (imagePath) {
        $('#thumbnail-list').prepend(`<div class="row"><img src="${imagePath}"/></div>`);
    }
});
