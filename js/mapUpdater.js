/**
 * download maps and upload maps
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    progress = require('request-progress'),
    http = require('http'),
    mkdirp = require('mkdirp');

var host = localStorage.getItem('host');
var mapDownloadURL= host + ":8088/gs-robot/data/download_map";
var mapUploadURL = host+":8088/gs-robot/data/upload_map";
var getMapListURL = host+":8080/gs-robot/data/maps";
var mapBeginURL = host+":8080/gs-robot/cmd/launch_map_loader";
var mapOverURL = host+":8080/gs-robot/cmd/shutdown_map_loader";
var hostname = host.split('/')[2];
var mapList = [];

// $('.modal-trigger').leanModal();

//send the start request at the first time
$.ajax({
    url:mapBeginURL,
    type:"GET",
    success:function(data) {
        console.log("start response: "+data);
        var object = JSON.parse(data);
        if(object.errorCode === "") {
            Materialize.toast("Start successfully!", 4000);
        } else {
            toastError("Start server failed!");
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        $("#mapProgressBar").css("visibility", "hidden");
        console.log("mapupdater start error: "+textStatus);
        if(textStatus === 'error') {
            toastError("Start module failed!");
            toastError("Please connect to the Robot WI-FI first and refresh!");
        }
    }
});

function toastError(string) {
    var text =  "<span style='color: #ff0000;font-size: 25px'>"+string+"</span></div>";
    Materialize.toast(text,20000);
}
/**
 * ===========================================================================================
 *                                    download project
 * ===========================================================================================
 */
//download multiple map packages
function downloadFile(urlData,fileName,toast){
    $("#mapProgressBar").css("visibility", "visible");

    var out = fs.createWriteStream('./map_download/' + fileName+".tar.gz");

    //use nodejs http module
    var options = {
        hostname:hostname,
        port:8088,
        path: "/gs-robot/data/download_map?map_name="+fileName,
        headers: {
            //need this header
            'Connection':'keep-alive'
        }
    };

    http.get(options,function(res){
        res.on('data',function(data) {
            console.log(data);
            out.write(data);
        }).on('end',function() {
            out.end();
            $("#mapProgressBar").css("visibility", "hidden");
            Materialize.toast(fileName +toast, 4000);
            Materialize.toast(fileName + " is saved in map_download folder!", 6000);
        }).on('error',function() {
            $("#mapProgressBar").css("visibility", "hidden");
            toastError("Download map failed!");
        });
    });
}

function getImageList() {
    $.ajax({
        url: getMapListURL,
        type: "GET",
        dataType: "json",
        success: function (data) {
            console.log("get map list response: "+data);
            localStorage["mapList"] = JSON.stringify(data);
        }
    });
}

function parseMapList() {
    var mapDataArray = [];
    var jsonText = localStorage["mapList"];
    var obj = JSON.parse(jsonText);
    var tempArray = obj.data;
    for (var i = 0; i < tempArray.length; i++) {
        var data = tempArray[i];
        mapDataArray.push(data.name);
    }
    return mapDataArray;
}

document.getElementById('mapDownload').addEventListener('click', function () {
    getImageList();
    mapList = [];
    mapList = parseMapList();
    //getmapList();
    console.log(mapList);
    $('#mapList').openModal();

    fs.stat('./map_download',function(err,stat) {
        if(err === null) {
            //folder is existed do nothing
        } else {
            mkdirp('./map_download',function(err) {
                console.log(err);
            });
        }
    });

    //create a download list
    var list = document.createElement("form");
    var content = document.getElementById('map-list-content');
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.innerText = "Select map";
    content.appendChild(h);
    list.setAttribute('action', "#");
    for(var i=0;i<mapList.length;i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group2');
        //support multiple selection
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', 'test' + i);
        input.setAttribute('value',mapList[i]);
        var label = document.createElement('label');
        label.setAttribute('for', 'test' + i);
        label.innerText = mapList[i];
        p.appendChild(input);
        p.appendChild(label);
        list.appendChild(p);
    }
    content.appendChild(list);
});

document.getElementById('mapDownloadSubmit').addEventListener('click',function() {
    $("#mapProgressBar").css("visibility", "visible");
    var selectedMap = $('input[name="group2"]:checked');
    console.log(selectedMap.length);
    for(var i=0;i<selectedMap.length;i++) {
        console.log(selectedMap[i].value);
        downloadFile(mapDownloadURL+"?map_name="+selectedMap[i].value, selectedMap[i].value, ' is downloaded !');
    }
});

/**
 * ===========================================================================================
 *                                         Upload
 * ===========================================================================================
 */
//show selected files in a list and the progress text
$('input[type=file]').change(function() {
    var form = document.forms["mapUploadForm"];
    if (form["file"].files.length > 0) {
        $("#mapUploadBtn").css("background-color", "#2196F3");
        $("#mapUploadBtn").css("color", "#FFFFFF");
        var files = form["file"].files;
        var ul = document.getElementById('listContainer');

        clearList();

        var li_1 = document.createElement('li');
        li_1.setAttribute('class', 'collection-item');
        var h = document.createElement('h5');
        h.innerText = "Upload file list";
        li_1.appendChild(h);
        ul.appendChild(li_1);

        for(var i=0;i<files.length;i++) {
            var li = document.createElement('li');
            li.setAttribute('class', 'collection-item');
            var div = document.createElement('div');
            div.setAttribute('id','list'+i);
            div.textContent = files[i].name;
            var a = document.createElement('a');
            a.setAttribute('class','secondary-content');
            a.setAttribute('id', "progress" + (i+1));
            var a1 = document.createElement('a');
            a1.textContent = " SIZE: "+parseInt(files[i].size/1024)+"KB";
            a.textContent = "0%";
            div.appendChild(a);
            div.appendChild(a1);
            li.appendChild(div);
            ul.appendChild(li);
        }
    } else {
        alert("Please choose a file.");
        $("#mapUploadBtn").css("background-color", "#DFDFDF");
        $("#mapUploadBtn").css("color", "#9F9F9F");
    }
});

function clearList() {
    var list = document.getElementById('listContainer');
    list.innerHTML = "";
}

function mapUploadAndSubmit() {
    event.preventDefault();
    var form = document.forms["mapUploadForm"];
    //var fileName = $("[name='file']#fileID").val().split('\\').pop();
    ////var fileName= $("[name='file']#fileID").val();
    //console.log(fileName);
    $("#mapProgressBar").css("visibility", "visible");
    if (form["file"].files.length > 0) {

        // 寻找表单域中的 <input type="file" ... /> 标签
        var files = form["file"].files;
        console.log(files);

        for(var i=0;i<files.length;i++) {
            /**
             * Edit: jQuery ajax is not able to handle binary responses properly (can't set responseType), so it's better to use a plain XMLHttpRequest call.
             * @type {XMLHttpRequest}
             */
            upload(files[i],i);
        }
    } else {
        alert("Please choose a file.");
        $("#mapUploadBtn").css("background-color", "#DFDFDF");
        $("#mapUploadBtn").css("color", "#9F9F9F");
    }
}

function upload(file,i) {
    var xhr = new XMLHttpRequest();
    (xhr.upload || xhr).addEventListener('progress', function (e) {
        var done = e.position || e.loaded;
        var total = e.totalSize || e.total;
        console.log('xhr progress: ' + Math.round(done / total * 100) + '%');
        //example update the progress data
        document.getElementById('progress'+(i+1)).innerText = Math.round(done / total * 100) + '%';
    });
    // 请求完成时建立一个处理程序
    xhr.onload = function () {
        console.log("upload map package response: " + xhr.response);
        var object = JSON.parse(xhr.response);
        if (object.successed) {
            // File(s) uploaded.
            Materialize.toast("Upload successfully!", 4000);
            $("#mapProgressBar").css("visibility", "hidden");
        } else {
            toastError("Upload failed!");
            toastError(object.errorCode);
            //Materialize.toast("Upload failed!", 4000);
            $("#mapProgressBar").css("visibility", "hidden");
        }
    };
    xhr.onerror = function() {
        $("#mapProgressBar").css("visibility", "hidden");
        toastError('Upload failed!');
    };

    var fileName = file.name.split(".")[0];
    console.log("fileName:"+file.name+" "+fileName);
    console.log(mapUploadURL+"?map_name="+fileName);
    xhr.open("POST", mapUploadURL+"?map_name="+fileName);
    xhr.send(file);
}
/**
 * ===========================================================================================
 *                                          Go back
 * ===========================================================================================
 */
//comment you can check the codeUpdater
function mapBack() {
    mapBackEventSum = 1;
    console.log("back");

    $.ajax({
        url:mapOverURL,
        type:"GET",
        success:function(data) {
            console.log("shut down response: "+data);
        }
    });

    $('#content1').fadeOut('fast', function() {
        $(this).load('selectModule.html #content1', function() {
            checkReachable();
            localStorage.setItem('page', 'select');
            document.getElementById('mapModule').addEventListener('click',goMapModule);
            document.getElementById('firmwareModule').addEventListener('click',goFirmwareModule);
            // document.getElementById('backBtn').removeEventListener('click',false);
            $(this).fadeIn('fast');
        });
    });
}

if(mapBackEventSum === 0) {
    console.log(codeBackEventSum);
    if(codeBackEventSum) {
        document.getElementById('backBtn').removeEventListener('click', firmwareBack);
    }
    document.getElementById('backBtn').addEventListener('click', mapBack);
}

document.getElementById('resignIn').addEventListener('click',function() {
    if(localStorage.getItem('isSignIn')!=null) {
        localStorage.removeItem("isSignedIn");
    }
    location.href = 'signIn.html';
});