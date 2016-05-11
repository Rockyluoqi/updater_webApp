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
        checkReachable();
    });
}

function checkReachable() {
    var ip = localStorage.getItem('ip');
    var checkEditorURL = "http://"+ip+":8080/gs-robot/data/maps";
    var checkMapUpdaterURL = "http://"+ip+":8080/gs-robot/cmd/launch_map_loader";

    const isReachable = require('is-reachable');

    //check editor module whether reachable
    isReachable(checkEditorURL, (err, reachable) => {
        if(reachable) {
            $("#mapEditor").removeClass("disabled");
            document.getElementById('mapEditor').href = "./mapEditor/mapGallery.html";
        } else {
            $("#mapEditor").addClass("disabled");
            document.getElementById('mapEditor').href = "#";
            toastError("You can't edit map now. <br/><br/> Please check the net connection and try again! <br/><br/> (Click the fresh button)", 10000);
        }
        //console.log(reachable);
        //=> true
    });

    //check map updater module whether reachable
    isReachable(checkMapUpdaterURL, (err, reachable) => {
        if(reachable) {
            $("#mapModule").removeClass("disabled");
            document.getElementById('mapModule').href = "mapUpdater.html";
        } else {
            $("#mapModule").addClass("disabled");
            document.getElementById('mapModule').href = "#";
            toastError("You can't migrate map now. <br/><br/> Please check the net connection and try again! <br/><br/> (Click the fresh button)", 10000);
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

function toastError(string) {
    var text =  "<span style='color: #ff0000;font-size: 25px'>"+string+"</span></div>";
    Materialize.toast(text,20000);
}

document.getElementById('resignIn').addEventListener('click',function() {
    localStorage.removeItem("isSignedIn");
    location.href = 'signIn.html';
});

document.getElementById('reload').addEventListener('click', function () {
    checkReachable();
});

//document.getElementById('projectModule').addEventListener('click',function() {
//    location.href = "codeUpdater.html";
//});

readConfig();
