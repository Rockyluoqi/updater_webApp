/**
 * download
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url');
var restoreURL = "";
var downloadURL="";
var uploadURL = "";
var getPatternListURL = "http://127.0.0.1:8888/robotPattern";
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
function downloadFile(urlData,toast){
    //var aLink = document.createElement('a');
    //var evt = document.createEvent("HTMLEvents");
    //evt.initEvent("click");
    //aLink.download = fileName;
    //aLink.href = urlData;
    //aLink.dispatchEvent(evt);

    $("#progressBar").css("visibility", "visible");

    var file_name = url.parse(urlData).pathname.split('/').pop();
    console.log('filename: ' + file_name);
    var out = fs.createWriteStream('./download/' + file_name+".tar.gz");

    //check request
    request
        .get()
        .on('response',function(response) {
          if(response) {

          } else {

          }
        });

    //use 'request'
    request
        .get(urlData)
        .on('response', function(response) {
            if(response.statusCode != 200) {
                Materialize.toast(fileName+" is downloaded unsuccessfully. Because the package is incomplete.", 4000);
            }
            console.log(response.statusCode); // 200
            console.log(response.complete);
            console.log(response.headers['content-type']);
            console.log(response.headers['content-length']);
            var len = response.headers['content-length'];
        })
        .pipe(out)
        .on('finish', function() {
            console.log("finish.....");
            $("#progressBar").css("visibility", "hidden");
            Materialize.toast(file_name +toast, 4000);
        });

    //use xmlhttprequest
    //var req = new XMLHttpRequest();
    //req.open('GET',urlData,true);
    //req.overrideMimeType ('text / plain; charset = x-user-defined');
    //req.send();
}

//var $upload = $('#upload');
//$upload.('change',onFileInputChange,false);
/**
 * test
 * @type {Array}
 */
var patternList = [];
function getPatternList() {
    $.ajax({
        url:getPatternListURL,
        type:"get",
        dataType:"json",
        async:false,
        success: function(data) {
            patternList = data;
        }
    });
}
/**
 * use
 */
//function getImageList() {
//    $.ajax({
//        url: urlStart + "/gs-robot/data/maps",
//        type: "GET",
//        dataType: "json",
//        async: false,
//        success: function (data) {
//            localStorage["mapList"] = JSON.stringify(data);
//        }
//    });
//}
//
//function parseMapList() {
//    var mapDataArray = [];
//    var jsonText = localStorage["mapList"];
//    var obj = JSON.parse(jsonText);
//    var tempArray = obj.data;
//    for (var i = 0; i < tempArray.length; i++) {
//        var data = tempArray[i];
//        mapDataArray.push(data.name);
//    }
//    return mapDataArray;
//}

document.getElementById('download').addEventListener('click', function () {
    patternList = [];
    getPatternList();
    console.log(patternList);

    var list = document.createElement("form");
    var content = document.getElementById('list-content');
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
    var selectedMap = $('input[name="group1"]:checked');
    console.log(selectedMap.length);
    for(let value of selectedMap) {
        console.log(value);
        downloadFile("" + value,' is downloaded !');
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

            var xhr = new XMLHttpRequest();
            (xhr.upload || xhr).addEventListener('progress', function (e) {
                var done = e.position || e.loaded;
                var total = e.totalSize || e.total;
                console.log('xhr progress: ' + Math.round(done / total * 100) + '%');

                //example update the progress data
                $('#progress'+(i+1)).innerText = Math.round(done / total * 100) + '%';
            });
            // 请求完成时建立一个处理程序。
            xhr.onload = function () {
                if (xhr.status === 200) {
                    // File(s) uploaded.
                    Materialize.toast("upload success", 4000);
                } else {
                    alert('An error occurred!');
                }
            };

            xhr.open("POST", "uploadURL");
            xhr.send(files[i]);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log("upload complete");
                        console.log("response: " + xhr.responseText);
                        $("#progressBar").css("visibility", "hidden");
                    }
                }
            };

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