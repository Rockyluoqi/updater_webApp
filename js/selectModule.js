/**
 * Created by Luoqi on 4/29/2016.
 */
var fs = require("fs");
var modelList = [];

//control the event register
var codeBackEventSum = 0;
var mapBackEventSum = 0;

//control the go back button event register
var mapBack = null;
var firmwareBack = null;
var mapIsReachable = false;

//read config json file named ipConfig.json using Node filesystem module
function readConfig() {
    localStorage.setItem('page', 'select');
    fs.readFile("./ipConfig.json","utf-8",function(error, fileData){
        console.log("error "+error);
        //save in localStorage for sharing the json data among javascript files.
        localStorage.setItem('ipConfig',fileData);

        var object = JSON.parse(fileData);
        console.log(object);

        //make a new modelList
        for(var one in object) {
            modelList.push(one);
        }
        console.log(localStorage.getItem('currentModel'));

        //if you open the app again, you don't need to select again.It has a default value in the localStorage
        if(localStorage.getItem('currentModel') === null || localStorage.getItem('currentModel') === "") {
            selectModel('list-content');
            $('#modelList').openModal();
        } else {
            checkReachable();
            localStorage.setItem('currentModel', localStorage.getItem('currentModel'));
            var tempModel = localStorage.getItem('currentModel');
            localStorage.setItem('host',object[tempModel].host);
            console.log(object[localStorage.getItem('currentModel')].host);
            //set robot icon image
            if(tempModel === 'GS-AS-01') {
                $('#robotImage').attr('src', './css/icon/robot-topdown-color-horizontal.png');
                $("#modelLabel").text(tempModel);
            }
            if(tempModel === 'GS-SR-01') {
                $('#robotImage').attr('src','./css/icon/service-robot-white.png');
                $("#modelLabel").text(tempModel);
            }
        }
    });
}

//select the model again
document.getElementById('modelLabel').addEventListener('click',function() {
    selectModel('list-content');
    $('#modelList').openModal();
});

document.getElementById('chooseModelBtn').addEventListener('click',saveChooseModel);
function saveChooseModel() {
    var robotModel = $('input[name="group1"]:checked');
    var currentModel = robotModel[0].value;
    $("#modelLabel").text(currentModel);
    localStorage.setItem('currentModel', currentModel);
    localStorage.setItem('currentModel', currentModel);
    console.log(localStorage.getItem('currentModel'));

    if(currentModel === 'GS-AS-01') {
        $('#robotImage').attr('src', './css/icon/robot-topdown-color-horizontal.png');
    }
    if(currentModel === 'GS-SR-01') {
        $('#robotImage').attr('src','./css/icon/service-robot-white.png');
    }

    var object = JSON.parse(localStorage.getItem('ipConfig'));
    localStorage.setItem('host',object[currentModel].host);
    console.log(object[currentModel].host);
    if(localStorage.getItem('page') === 'select') {
        checkReachable();
    }
}

//create a model list in the modal
function selectModel(listID) {
    var list = document.createElement("form");
    var content = document.getElementById(listID);
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.textContent = "Select robot model";
    content.appendChild(h);
    list.setAttribute('action', "#");
    for (var i = 0; i < modelList.length; i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group1');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', 'test' + i);
        input.setAttribute('value',modelList[i]);
        var label = document.createElement('label');
        label.setAttribute('for', 'test' + i);
        label.textContent = modelList[i];
        var img = document.createElement('img');
        if(label.textContent === 'GS-AS-01') {
            img.setAttribute('src', './css/icon/robot-topdown-color-horizontal.png');
            img.setAttribute('style','position:absolute;padding-left:20px;padding-top:3px;');
        }
        if(label.textContent === 'GS-SR-01') {
            img.setAttribute('src', './css/icon/service-robot-blue.png');
            img.setAttribute('style','position:absolute;padding-left:20px;padding-top:3px;');
        }
        p.appendChild(input);
        p.appendChild(label);
        p.appendChild(img);
        list.appendChild(p);
    }
    content.appendChild(list);
}

function checkReachable() {
    var host = localStorage.getItem('host');
    var checkEditorURL = host+":8080/gs-robot/data/maps";
    var checkMapUpdaterURL = host+":8080/gs-robot/cmd/launch_map_loader";

    const isReachable = require('is-reachable');

    //remove all toasts which are not finished.
    $('.toast').remove();

    //check map updater module whether reachable
    isReachable(checkMapUpdaterURL, (err, reachable) => {
        if(reachable) {
            $("#mapModule").removeClass("disabled");
            // document.getElementById('mapModule').href = "mapUpdater.html";
            mapIsReachable = true;
        } else {
            $("#mapModule").addClass("disabled");
            mapIsReachable = false;
            if(mapBackEventSum) {
                document.getElementById('mapModule').removeEventListener('click', goMapModule);
            }
            //risky change
            document.getElementById('mapModule').removeEventListener('click', goMapModule);
            document.getElementById('backBtn').removeEventListener('click',mapBack);
            document.getElementById('mapModule').href = "#";
            toastError("You can't migrate map now. <br/><br/> Please check the net connection and try again! <br/><br/> (Click the fresh button)", 10000);
        }
    });

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
    });
}

function toastError(string) {
    var text =  "<span style='color: #ff0000;font-size: 25px'>"+string+"</span></div>";
    Materialize.toast(text,10000);
}

document.getElementById('resignIn').addEventListener('click',function() {
    localStorage.removeItem('currentModel');
    localStorage.removeItem("isSignedIn");
    location.href = 'signIn.html';
});

//the reload button's function on the navigation bar
document.getElementById('reload').addEventListener('click', function () {
    if(localStorage.getItem('page') === 'select') {
        checkReachable();
    } else if(localStorage.getItem('page') === 'firmware') {
        //back button will bind again
        codeBackEventSum = 0;
        goFirmwareModule();
    } else if(localStorage.getItem('page') === 'map') {
        //back button will bind again
        mapBackEventSum = 0;
        goMapModule();
    }
});

document.getElementById('firmwareModule').addEventListener('click',goFirmwareModule);
function goFirmwareModule() {
    if(localStorage.getItem('currentModel') === null || localStorage.getItem('currentModel') === "") {
        selectModel('list-content');
        $('#modelList').openModal();
    } else {
        $('#titleText').text("FIRMWARE UPDATE");
        $('.material-tooltip').remove();
        $('.toast').remove();
        localStorage.setItem('page', 'firmware');
        console.log('firmware update');
        //core code to make a one page app, the navigation bar doesn't need to change
        $('#content1').fadeOut('fast', function () {
            $(this).load('codeUpdater.html', function () {
                // $('#nav').remove();
                $(this).fadeIn('fast');
            });
        });
    }
}

document.getElementById('mapModule').addEventListener('click',goMapModule);
function goMapModule() {
    if(localStorage.getItem('currentModel') === null || localStorage.getItem('currentModel') === "") {
        selectModel('list-content');
        $('#modelList').openModal();
    } else {
        $('#titleText').text("MAP MIGRATION");
        $('.material-tooltip').remove();
        $('.toast').remove();
        console.log('map migration');
        localStorage.setItem('page', 'map');
        $('#content1').fadeOut('fast', function () {
            $(this).load('mapUpdater.html', function () {
                // $('#nav').remove();
                $(this).fadeIn('fast');
            });
        });
    }
}

document.getElementById('backBtn').addEventListener('click',function() {
    // localStorage.removeItem("isSignedIn");
    // location.href = 'signIn.html';
});

readConfig();
