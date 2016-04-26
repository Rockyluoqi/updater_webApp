/**
 * download
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    progress = require('request-progress'),
    mkdirp = require('mkdirp');

var restoreURL = "";
//var downloadURL="http://127.0.0.1:8888/downloadMap";

var beginURL = "";
var overURL = "";
var mapListURL = "";
var urlStart = "";
$('.modal-trigger').leanModal();
//get pattern list at the first time
//var patternList = [];
//$.ajax({
//  url:"",
//  type:"get",
//  dataType:"json",
//  success: function(data) {
//    if(data.successed) {
//      patternList.push(data);
//    }
//  }
//});
//document.getElementById("download").addEventListener('click',function(e) {
//  e.preventDefault();
//
//  downloadFile('data.zip','https://github.com/Rockyluoqi/FlowGraph/archive/master.zip');
//});
//

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

    $("#progressBar").css("visibility", "visible");

    //var file_name = url.parse(urlData).pathname.split('/').pop();
    //console.log('filename: ' + file_name);
    var out = fs.createWriteStream('./.map_download/' + fileName+".tar.gz");

    console.log(urlData);

    //use nodejs http module
    var options = {
        hostname:'192.168.1.105',
        port:8088,
        path: "/gs-robot/data/download_map?map_name="+file_name,
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
            $("#progressBar").css("visibility", "hidden");
            Materialize.toast(file_name +toast, 4000);
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
        async: false,
        success: function (data) {
            //console.log(data);
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

    fs.stat('./.map_download',function(err,stat) {
        if(err === null) {
            //folder is existed do nothing
        } else {
            mkdirp('./.map_download',function(err) {
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
    $("#progressBar").css("visibility", "visible");
    var selectedMap = $('input[name="group1"]:checked');
    console.log(selectedMap.length);
    for(var i=0;i<selectedMap.length;i++) {
        console.log(selectedMap[i].value);
        //downloadFile("" + value,' is downloaded !');
        downloadFile(downloadURL+"?mapName = "+selectedMap[i].value, selectedMap[i].value, ' is downloaded !');
    }
    //downloadFile("url"+robotPattern+".zip",' is downloaded !');
    //downloadFile("http://127.0.0.1:8888/robot1package",' is downloaded !');
});



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
    $("#progressBar").css("visibility", "visible");
    if (form["file"].files.length > 0) {

        // 寻找表单域中的 <input type="file" ... /> 标签
        var files = form["file"].files;

        for(var i=0;i<files.length;i++) {
            //var formData = new FormData();
            //
            //for(var i=0;i<files.length;i++) {
            //  var file = files[i];
            //  formData.append(file.name, file);
            //}
            /**
             * Edit: jQuery ajax is not able to handle binary responses properly (can't set responseType), so it's better to use a plain XMLHttpRequest call.
             * @type {XMLHttpRequest}
             */
            upload(files[i],i);

            //xhr.onreadystatechange = function () {
            //    if (xhr.readyState == 4) {
            //        if (xhr.status == 200) {
            //            console.log("upload complete");
            //            console.log("response: " + xhr.responseText);
            //            $("#progressBar").css("visibility", "hidden");
            //        }
            //    }
            //};

            ////use request module
            //var senfile = fs.createReadStream(file).pipe(request.POST("URL").function);
            //request.POST("url")
        }


        //console.log(files);
        //// try sending
        //for(var i=0;i<files.length;i++) {
        //  var file = files[i];
        //  var reader = new FileReader();
        //
        //  reader.onloadstart = function () {
        //    // 这个事件在读取开始时触发
        //    console.log("onloadstart");
        //    document.getElementById("bytesTotal").textContent = file.size;
        //    $("#progressBar").css("visibility", "visible");
        //  };
        //  reader.onprogress = function (p) {
        //    // 这个事件在读取进行中定时触发
        //    console.log("onprogress");
        //    document.getElementById("bytesRead").textContent = p.loaded;
        //  };
        //
        //  reader.onload = function () {
        //    // 这个事件在读取成功结束后触发
        //    console.log("load complete");
        //  };
        //
        //  reader.onloadend = function () {
        //    // 这个事件在读取结束后，无论成功或者失败都会触发
        //    if (reader.error) {
        //      console.log(reader.error);
        //    } else {
        //      document.getElementById("bytesRead").textContent = file.size;
        //      // 构造 XMLHttpRequest 对象，发送文件 Binary 数据
        //      for (var i = 0; i < files.length; i++) {
        //        //or use ajax
        //
        //        var xhr = new XMLHttpRequest();
        //        xhr.open(/* method */ "POST",
        //            /* target url */ "upload.jsp?fileName=" + file.name
        //            /*, async, default to true */);
        //        xhr.overrideMimeType("application/octet-stream");
        //        var zipBinaryBytes = new Uint8Array(reader.result.length);
        //        for (var i = 0; i < reader.result.length; ++i) {
        //          zipBinaryBytes[i] = reader.result.charCodeAt(i);
        //        }
        //        var zipBinary = new Blob([zipBinaryBytes], {type: 'application/zip'});
        //
        //        //sendData(zipBinary);
        //        xhr.send(zipBinary);
        //        console.log(zipBinary);
        //        xhr.onreadystatechange = function () {
        //          if (xhr.readyState == 4) {
        //            if (xhr.status == 200) {
        //              console.log("upload complete");
        //              console.log("response: " + xhr.responseText);
        //              $("#progressBar").css("visibility", "hidden");
        //            }
        //          }
        //        }
        //      }
        //    }
        //  };
        //  reader.readAsBinaryString(file);
        //}
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
        console.log("response" + xhr.response);
        var object = JSON.parse(xhr.response);
        if (object.successed) {
            // File(s) uploaded.
            Materialize.toast("Upload successfully!", 4000);
            $("#progressBar").css("visibility", "hidden");
        } else {
            Materialize.toast("Upload unsuccessfully!", 4000);
            $("#progressBar").css("visibility", "hidden");
        }
    };

    var fileName = file.name.split(".")[0];
    console.log("fileName:"+file.name+" "+fileName);
    xhr.open("POST", uploadURL+"?map_name="+fileName);
    xhr.send(file);
}

function back() {
    console.log("back");
    location.href = "selectModule.html";
}