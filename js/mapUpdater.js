/**
 * download
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    progress = require('request-progress'),
    http = require('http'),
    mkdirp = require('mkdirp');

var ip = localStorage.getItem('ip');
//var downloadURL="http://127.0.0.1:8888/downloadMap";
var downloadURL="http://"+ip+":8088/gs-robot/data/download_map";
var uploadURL = "http://"+ip+":8088/gs-robot/data/upload_map";
var getMapListURL = "http://"+ip+":8080/gs-robot/data/maps";
var beginURL = "http://"+ip+":8080/gs-robot/cmd/launch_map_loader";
var overURL = "http://"+ip+":8080/gs-robot/cmd/shutdown_map_loader";
var hostname = ip;
var mapListURL = "";
var urlStart = "";
$('.modal-trigger').leanModal();
localStorage.setItem('page',"map");
$.ajax({
    url:beginURL,
    type:"GET",
    success:function(data) {
        console.log("start response: "+data);
        if(data.errorCode === "") {
            Materialize.toast("Start successfully!", 4000);
        } else {
            //toastError("Start failed!");
            //Materialize.toast("<span style='color: #ff0000;font-size: 30px'>"+"Start failed!"+"</span></div>", 4000);
        }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("mapupdater start error: "+textStatus);
        if(textStatus == 'error') {
            toastError("Start module failed!");
            toastError("Please connect to the Robot WI-FI first and refresh!");
            //Materialize.toast("<span style='color: #ff0000;font-size: 30px'>"+"Start module failed!"+"</span></div>",20000);
            //Materialize.toast("<span style='color: #ff0000;font-size: 30px'>"+"Please connect to the Robot WI-FI first and refresh!"+"</span></div>",20000);
        }
    }
});

function toastError(string) {
    var text =  "<span style='color: #ff0000;font-size: 30px'>"+string+"</span></div>";
    Materialize.toast(text,20000);
}
/**
 * ===========================================================================================
 *                                    download project
 * ===========================================================================================
 */
function downloadFile(urlData,fileName,toast){
    //var aLink = document.createElement('a');
    //var evt = document.createEvent("HTMLEvents");
    //evt.initEvent("click");
    //aLink.download = fileName;
    //aLink.href = urlData;
    //aLink.dispatchEvent(evt);

    $("#mapProgressBar").css("visibility", "visible");

    //var file_name = url.parse(urlData).pathname.split('/').pop();
    //console.log('filename: ' + file_name);
    var out = fs.createWriteStream('./map_download/' + fileName+".tar.gz");

    console.log(urlData);

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
        });
    });
}

//var $upload = $('#upload');
//$upload.('change',onFileInputChange,false);
/**
 * test
 * @type {Array}
 */
//var patternList = [];
//function getPatternList() {
//    $.ajax({
//        url:,
//        type:"get",
//        dataType:"json",
//        async:false,
//        success: function(data) {
//            patternList = data;
//        }
//    });
//}
/**
 * use
 */
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
var patternList = [];
document.getElementById('download').addEventListener('click', function () {
    getImageList();
    patternList = [];
    patternList = parseMapList();
    //getPatternList();
    console.log(patternList);

    fs.stat('./map_download',function(err,stat) {
        if(err === null) {
            //folder is existed do nothing
        } else {
            mkdirp('./map_download',function(err) {
                console.log(err);
            });
        }
    });

    var list = document.createElement("form");
    var content = document.getElementById('list-content');
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.innerText = "Select map";
    content.appendChild(h);
    list.setAttribute('action', "#");
    for(var i=0;i<patternList.length;i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group1');
        //support multiple selection
        input.setAttribute('type', 'checkbox');
        input.setAttribute('id', 'test' + i);
        input.setAttribute('value',patternList[i]);
        var label = document.createElement('label');
        label.setAttribute('for', 'test' + i);
        label.innerText = patternList[i];
        p.appendChild(input);
        p.appendChild(label);
        list.appendChild(p);
    }
    content.appendChild(list);
});

document.getElementById('downloadSubmit').addEventListener('click',function() {
    $("#mapProgressBar").css("visibility", "visible");
    var selectedMap = $('input[name="group1"]:checked');
    console.log(selectedMap.length);
    for(var i=0;i<selectedMap.length;i++) {
        console.log(selectedMap[i].value);
        //downloadFile("" + value,' is downloaded !');
        downloadFile(downloadURL+"?mapName="+selectedMap[i].value, selectedMap[i].value, ' is downloaded !');
    }
    //downloadFile("url"+robotPattern+".zip",' is downloaded !');
    //downloadFile("http://127.0.0.1:8888/robot1package",' is downloaded !');
});

document.getElementById("refreshBtn").addEventListener('click', refresh);

function refresh() {
    location.reload();
}
/**
 * ===========================================================================================
 *                                         Upload
 * ===========================================================================================
 */
//show selected files in a list
$('input[type=file]').change(function() {
    var form = document.forms["uploadForm"];
    if (form["file"].files.length > 0) {
        $("#uploadBtn").css("background-color", "#2196F3");
        $("#uploadBtn").css("color", "#FFFFFF");
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
        $("#uploadBtn").css("background-color", "#DFDFDF");
        $("#uploadBtn").css("color", "#9F9F9F");
    }
});

function clearList() {
    var list = document.getElementById('listContainer');
    list.innerHTML = "";
}

function uploadAndSubmit() {
    event.preventDefault();
    var form = document.forms["uploadForm"];
    //var fileName = $("[name='file']#fileID").val().split('\\').pop();
    ////var fileName= $("[name='file']#fileID").val();
    //console.log(fileName);
    $("#mapProgressBar").css("visibility", "visible");
    if (form["file"].files.length > 0) {

        // 寻找表单域中的 <input type="file" ... /> 标签
        var files = form["file"].files;

        for(var i=0;i<files.length;i++) {
            /**
             * Edit: jQuery ajax is not able to handle binary responses properly (can't set responseType), so it's better to use a plain XMLHttpRequest call.
             * @type {XMLHttpRequest}
             */
            upload(files[i],i);
        }
    } else {
        alert("Please choose a file.");
        $("#uploadBtn").css("background-color", "#DFDFDF");
        $("#uploadBtn").css("color", "#9F9F9F");
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
            //Materialize.toast("Upload failed!", 4000);
            $("#mapProgressBar").css("visibility", "hidden");
        }
    };

    var fileName = file.name.split(".")[0];
    console.log("fileName:"+file.name+" "+fileName);
    xhr.open("POST", uploadURL+"?map_name="+fileName);
    xhr.send(file);
}

function back() {
    console.log("back");
    $.ajax({
        url:overURL,
        type:"GET",
        success:function(data) {
            console.log("shut down response: "+data);
        }
    });
    location.href = "selectModule.html";
}