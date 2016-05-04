/**
 * Created by Luoqi on 4/29/2016.
 */
var fs = require("fs");
function readConfig() {
    fs.readFile("./ipConfig.json","utf-8",function(error, fileData){
        console.log("error "+error);

        var object = JSON.parse(fileData);
        console.log("IP: "+object.ip);
        localStorage.setItem('ip',object.ip);
        checkEditorModule();
    });
}

function checkEditorModule() {
    var ip = localStorage.getItem('ip');
    var checkURL = "http://"+ip+":8080/gs-robot/data/maps";

    const isReachable = require('is-reachable');

    isReachable(checkURL, (err, reachable) => {
        if(reachable) {
            $("#mapEditor").removeClass("disabled");
            document.getElementById('mapEditor').href = "./mapEditor/mapGallery.html";
        } else {
            $("#mapEditor").addClass("disabled");
            document.getElementById('mapEditor').href = "#";
            Materialize.toast("You can't edit map now. Please check the net connection and try again! (Click the fresh button)", 10000);
        }
        //console.log(reachable);
        //=> true
    });

    //const http = require('http');
    //var isOnline = require('is-online');
    //
    //isOnline(function(err, online) {
    //    console.log(err);
    //    console.log(online);
    //    //=> true
    //});
    //var options = {
    //    hostname:ip,
    //    port:8080,
    //    path: "/gs-robot/data/maps"
    //};
    //
    //http.get(options,function(res){
    //    if(res.statusCode === 200) {
    //        console.log("map editor success");
    //    } else {
    //        console.log("Got error: ");
    //    }
    //});//on('error', function(e) {
    //    console.log("Got error: " + e.message);
    //});

    //$.ajax({
    //    url:checkURL,
    //    type:"GET",
    //    dataType:'json',
    //    success:function(data){
    //        console.log(data);
    //        $("#mapEditor").css("visibility", "visible");
    //    },
    //    error: function (XMLHttpRequest, textStatus, errorThrown) {
    //        console.log("check connection response: "+textStatus);
    //        $("#mapEditor").css("visibility", "hidden");
    //        if (textStatus == 'error') {
    //            Materialize.toast("You can't edit map now. Please check the net connection.", 10000);
    //        }
    //    }
    //});
}

readConfig();
