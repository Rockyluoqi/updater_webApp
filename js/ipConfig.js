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

document.getElementById('projectModule').addEventListener('click',goProjectModule);
var eventSum = 0;
function goProjectModule() {
    console.log('firmware update');
    // if($('#backBtn').length) {
    //     document.getElementById('backBtn').setAttribute('id','backBtn1');
    // }
    $('#content1').fadeOut('fast', function() {
        $(this).load('codeUpdater.html', function() {
            // $('#nav').remove();
            $(this).fadeIn('fast')  ;
        });
    });
}

document.getElementById('backBtn').addEventListener('click',function() {
    // localStorage.removeItem("isSignedIn");
    // location.href = 'signIn.html';
});

//document.getElementById('projectModule').addEventListener('click',function() {
//    location.href = "codeUpdater.html";
//});

readConfig();
