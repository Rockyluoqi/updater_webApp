/**
 * download
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    progress = require('request-progress'),
    mkdirp = require('mkdirp'),
    os = require('os');

//default URLs


$('.modal-trigger').leanModal();

/**
 * ===========================================================================================
 *                                    download project
 * ===========================================================================================
 */
function downloadFile(urlData, toast) {
    //var aLink = document.createElement('a');
    //var evt = document.createEvent("HTMLEvents");
    //evt.initEvent("click");
    //aLink.download = fileName;
    //aLink.href = urlData;
    //aLink.dispatchEvent(evt);

    var file_name = url.parse(urlData).pathname.split('/').pop();
    console.log('filename: ' + file_name);
    var out = fs.createWriteStream('./firmware_download/' + file_name);

    //use 'request'
    //request
    //    .get(urlData)
    //    .on('response', function (response) {
    //        console.log(response.statusCode); // 200
    //        console.log(response.complete);
    //        console.log(response.headers['content-type']);
    //        console.log(response.headers['content-length']);
    //        var len = response.headers['content-length'];
    //    })
    //    .pipe(out)
    //    .on('finish', function () {
    //        console.log("finish.....");
    //        $("#progressBar").css("visibility", "hidden");
    //        Materialize.toast(file_name + toast, 4000);
    //    });

    var downloadError = false;
    //use request and request-module
    // The options argument is optional so you can omit it
    progress(request(urlData), {
        throttle: 0,                    // Throttle the progress event to 2000ms, defaults to 1000ms
        delay: 0,                       // Only start to emit after 1000ms delay, defaults to 0ms
        lengthHeader: 'content-length'  // Length header to use, defaults to content-length
    })
        .on('progress', function (state) {
            // The state is an object that looks like this:
            // {
            //     percentage: 0.5,            // Overall percentage (between 0 to 1)
            //     speed: 554732,              // The download speed in bytes/sec
            //     size: {
            //         total: 90044871,        // The total payload size in bytes
            //         transferred: 27610959   // The transferred payload size in bytes
            //     },
            //     time: {
            //         elapsed: 36.235,        // The total elapsed seconds since the start (3 decimals)
            //         remaining: 81.403       // The remaining seconds to finish (3 decimals)
            //     }
            // }
            //console.log('progress', state);
            document.getElementById('downloadProgress1').innerText = toDecimal2(state.percentage*100) + "%" + "  Speed: " + parseInt(state.speed/1024) +" KB/s";
        })
        .on('error', function (err) {
            console.log("download error: " + err);
            downloadError = true;
        })
        .on('end', function (response) {
            console.log("finish.....");
            $("#progressBar").css("visibility", "hidden");
            console.log(downloadError);
            if(!downloadError) {
                // Do something after request finishes
                Materialize.toast(file_name + toast, 4000);
            } else {
                Materialize.toast(file_name + " download unsuccessfully!", 4000);
                out.end();
                console.log("delete file"+file_name_to_delete);
                fs.unlinkSync('./firmware_download/' + file_name_to_delete);
            }
        })
        .pipe(out);
}

//to decimal, save 2 digits
function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*100)/100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

//var $upload = $('#upload');
//$upload.('change',onFileInputChange,false);
var patternList = [];
function getPatternList() {
    $.ajax({
        url: getPatternListURL,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (data) {
            if(data.successed) {
                patternList = data;
            } else {
                console.log(data);
                Materialize.toast("Oops... Get robot list unsuccessfully.", 4000);
            }
        }
    });
}

document.getElementById('download').addEventListener('click', function () {
    //test
    patternList = ["GS-AS-01","GS-SR-01"];
    //patternList = [];
    //getPatternList();
    //console.log(patternList);

    fs.stat('./firmware_download', function (err, stat) {
        if (err === null) {
            //folder is existed do nothing
        } else {
            mkdirp('./firmware_download', function (err) {
                console.log(err);
            });
        }
    });

    var list = document.createElement("form");
    var content = document.getElementById('list-content');
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.innerText = "Select Robot";
    content.appendChild(h);
    list.setAttribute('action', "#");
    for (var i = 0; i < patternList.length; i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group1');
        input.setAttribute('type', 'radio');
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

//function clearPatternList() {
//    var list = document.getElementById('listContainer');
//    list.innerHTML = "";
//}
var currentPattern ="";
var file_name_to_delete = "";
document.getElementById('downloadSubmit').addEventListener('click', function () {
    $("#progressBar").css("visibility", "visible");
    var robotPattern = $('input[name="group1"]:checked');
    currentPattern = robotPattern[0].value;

    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        var object = JSON.parse(xhr.response);
        console.log(object);
        if (object.msg === "successed") {
            Materialize.toast("Get UpdatePath successfully.", 4000);

            var ul = document.getElementById('listContainer');
            clearList();
            var li_1 = document.createElement('li');
            li_1.setAttribute('class', 'collection-item');
            var h = document.createElement('h5');
            h.innerText = "Downloading";
            li_1.appendChild(h);
            ul.appendChild(li_1);
            var li = document.createElement('li');
            li.setAttribute('class', 'collection-item');
            var div = document.createElement('div');
            div.setAttribute('id', 'list0');
            //div.textContent = files[i].name;
            div.innerText = object.data.pkg_file_url;
            file_name_to_delete = div.innerText;
            var a = document.createElement('a');
            a.setAttribute('class', 'secondary-content');
            a.setAttribute('id', "downloadProgress1");
            a.innerText = "0%";

            var a_svg = document.createElement('a');
            a_svg.setAttribute('class', 'secondary-content');
            a_svg.setAttribute('id', "close1");
            a_svg.setAttribute('style','margin-left:20px');
            a_svg.setAttribute('onclick','cancelAndDelete()');
            //var svg = document.createElement('svg');
            //svg.setAttribute('fill', '#00b0ff');
            //svg.setAttribute('height','24');
            //svg.setAttribute('width','24');
            //svg.setAttribute('viewBox','0 0 24 24');
            //svg.setAttribute('xmlns','http://www.w3.org/2000/svg');
            //var path1 = document.createElement('path');
            //var path2 = document.createElement('path');
            //path1.setAttribute('d','M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z');
            //path2.setAttribute('d','M0 0h24v24H0z');
            //path2.setAttribute('fill', 'none');
            //svg.appendChild(path1);
            //svg.appendChild(path2);

            var img = document.createElement('img');
            img.src = "css/icon/ic_cancel_black_24dp_1x.png";

            a_svg.appendChild(img);

            div.appendChild(a_svg);
            div.appendChild(a);
            li.appendChild(div);
            ul.appendChild(li);

            downloadFile(downloadURL + object.data.pkg_file_url, ' is downloaded !');
        } else {
            $("#progressBar").css("visibility", "hidden");
            Materialize.toast("Oops... Get UpdatePath unsuccessfully.", 4000);
        }
    };
    xhr.open("GET", getUpdatePathURL + currentPattern + "/latest");
    xhr.setRequestHeader("desktop_web_access_key",sessionStorage.getItem("accessKey"));
    xhr.setRequestHeader("client_type","DESKTOP_WEB");
    xhr.send(null);
    //var options = {
    //    url:getUpdatePathURL + robotPattern + "/latest",
    //    headers: {
    //        desktop_web_access_key: sessionStorage.getItem("accessKey"),
    //        client_type: "DESKTOP_WEB"
    //    }
    //};
    //
    //console.log(options.headers.client_type);
    //
    //request.get(options,function(e,r,body) {
    //    var object = JSON.parse(body);
    //    if (object.msg === "successed") {
    //        Materialize.toast("Get UpdatePath successfully.", 4000);
    //        downloadFile(downloadURL + data.pkg_file_url, ' is downloaded !');
    //    } else {
    //        Materialize.toast("Oops... Get UpdatePath unsuccessfully.", 4000);
    //    }
    //});
    //downloadFile("http://127.0.0.1:8888/robot1package",' is downloaded !');
});

function cancelAndDelete() {
    var content = document.getElementById('list0');
    content.innerHTML = "";
    Materialize.toast("Cancel downloading! ", 4000);
    $("#progressBar").css("visibility", "hidden");
}

function deleteAll(files) {
    for (let value of files) {
        fs.unlinkSync(value);
    }
}

//function cancel() {
//
//}

/**
 * ===========================================================================================
 *                                 restore the last version
 * ===========================================================================================
 */
document.getElementById('restore').addEventListener('click', function () {
    $("#progressBar").css("visibility", "visible");
    if(currentPattern === "GS-AS-01") {
        beginURL = urlMap.GS_AS_01.start_updater_api;
        restoreURL = urlMap.GS_AS_01.rollback_api;
    } else if(currentPattern = "GS_SR_01") {
        //overURL = urlMap.GS_AS_01.stop_updater_api;
    }
    request.post({url:beginURL},function(err,httpResponse,body) {
        setTimeout(function () {
            $.ajax({
                url: restoreURL,
                type: "GET",
                success: function (data) {
                    console.log(data);
                    var object = JSON.parse(data);
                    if (object.successed) {
                        $("#progressBar").css("visibility", "hidden");
                        Materialize.toast("Rollback successfully!", 4000);
                    } else {
                        $("#progressBar").css("visibility", "hidden");
                        Materialize.toast("Oops... Rollback unsuccessfully!", 4000);
                    }
                }
            });
        },3000);
    });

    ////删除目录下的所有文件
    //var files = getAllFiles('./download');
    //for (let value of files) {
    //    fs.unlinkSync(value);
    //}
    //
    //downloadFile(restoreURL, ' is restored !');

});

//获得指定目录下的所有文件
function getAllFiles(root) {
    var result = [], files = fs.readdirSync(root);
    files.forEach(function (file) {
        var pathname = root + "/" + file
            , stat = fs.lstatSync(pathname);
        if (stat === undefined) return;

        // 不是文件夹就是文件
        if (!stat.isDirectory()) {
            result.push(pathname);
            // 递归自身
        } else {
            result = result.concat(getAllFiles(pathname))
        }
    });
    return result;
}

/**
 * ===========================================================================================
 *                                         Upload
 * ===========================================================================================
 */
//show selected files in a list
$('input[type=file]').change(function () {
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

        for (var i = 0; i < files.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('class', 'collection-item');
            var div = document.createElement('div');
            div.setAttribute('id', 'list' + i);
            div.textContent = files[i].name;
            var a = document.createElement('a');
            a.setAttribute('class', 'secondary-content');
            a.setAttribute('id', "progress" + (i + 1));
            var a1 = document.createElement('a');
            a1.textContent = " SIZE: " + parseInt(files[i].size / 1024) + "KB";
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

function uploadSelectPattern() {
    getPatternList();
    console.log(patternList);

    var list = document.createElement("form");
    var content = document.getElementById('list-content');
    list.setAttribute('action', "#");
    for (var i = 0; i < patternList.length; i++) {
        var p = document.createElement('p');
        var input = document.createElement('input');
        input.setAttribute('name', 'group2');
        input.setAttribute('type', 'radio');
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
}

//document.getElementById('uploadSubmit').addEventListener('click', function () {
//    Materialize.toast('Downloading', 4000);
//    document.getElementById('fileID').click();
//});

function uploadAndSubmit() {
    event.preventDefault();
    //if(robotPattern === ) {
    //    beginURL = "";
    //}
    if(currentPattern === "GS-AS-01") {
        beginURL = urlMap.GS_AS_01.start_updater_api;
        uploadURL = urlMap.GS_AS_01.update_api;
    } else if(currentPattern = "GS_SR_01") {
        //overURL = urlMap.GS_AS_01.stop_updater_api;
    }
    //use request
    request.post({url:beginURL},function(err,httpResponse,body) {
        $("#progressBar").css("visibility", "visible");
        setTimeout(function () {
            console.log(httpResponse);
            var object = JSON.parse(body);
            console.log(object);
            if(object.successed) {
                var robotPattern = $('input[name="group2"]:checked').val();
                var form = document.forms["uploadForm"];
                var fileName = $("[name='file']#fileID").val().split('\\').pop();
                //var fileName= $("[name='file']#fileID").val();
                console.log(fileName);
                $("#progressBar").css("visibility", "visible");
                if (form["file"].files.length > 0) {

                    // 寻找表单域中的 <input type="file" ... /> 标签
                    var file = form["file"].files[0];

                    //var formData = new FormData();
                    //
                    //for(var i=0;i<files.length;i++) {
                    //  var file = files[i];
                    //  formData.append(file.name, file);
                    //}

                    var xhr = new XMLHttpRequest();
                    (xhr.upload || xhr).addEventListener('progress', function (e) {
                        var done = e.position || e.loaded;
                        var total = e.totalSize || e.total;
                        console.log('xhr progress: ' + Math.round(done / total * 100) + '%');
                        //example update the progress data
                        //$('#progress1').innerText = Math.round(done / total * 100) + '%';
                        document.getElementById('progress1').innerText = Math.round(done / total * 100) + '%';
                    });
                    // 请求完成时建立一个处理程序。
                    xhr.onload = function () {
                        console.log(xhr.status);
                        if (xhr.status == 200) {
                            Materialize.toast("Upload successfully", 4000);
                            $("#progressBar").css("visibility", "hidden");
                        } else {
                            Materialize.toast("Oops...Upload unsuccessfully", 4000);
                            $("#progressBar").css("visibility", "hidden");
                            console.log(xhr.response);
                        }
                    };

                    xhr.open("POST", uploadURL + file.name);
                    xhr.send(file);
                } else {
                    alert("Please choose a file.");
                    $("#uploadBtn").css("background-color", "#DFDFDF");
                    $("#uploadBtn").css("color", "#9F9F9F");
                }
            }
        },3000);
    });


    //uploadSelectPattern();
    //var robotPattern = $('input[name="group2"]:checked').val();

    //if(robotPattern === ) {
    //    beginURL = "";
    //}

    //event.preventDefault();
    //$.ajax({
    //    url: beginURL,
    //    type: "POST",
    //    async: false,
    //    success: function (data) {
    //        if (data.status === 200) {
    //            var form = document.forms["uploadForm"];
    //            var fileName = $("[name='file']#fileID").val().split('\\').pop();
    //            //var fileName= $("[name='file']#fileID").val();
    //            console.log(fileName);
    //            $("#progressBar").css("visibility", "visible");
    //            if (form["file"].files.length > 0) {
    //
    //                // 寻找表单域中的 <input type="file" ... /> 标签
    //                var file = form["file"].files[0];
    //
    //                //var formData = new FormData();
    //                //
    //                //for(var i=0;i<files.length;i++) {
    //                //  var file = files[i];
    //                //  formData.append(file.name, file);
    //                //}
    //
    //                var xhr = new XMLHttpRequest();
    //                (xhr.upload || xhr).addEventListener('progress', function (e) {
    //                    var done = e.position || e.loaded;
    //                    var total = e.totalSize || e.total;
    //                    console.log('xhr progress: ' + Math.round(done / total * 100) + '%');
    //
    //                    //example update the progress data
    //                    $('#progress1').innerText = Math.round(done / total * 100) + '%';
    //                });
    //                // 请求完成时建立一个处理程序。
    //                //xhr.onload = function () {
    //                //    if (xhr.response.successed) {
    //                //        // File(s) uploaded.
    //                //        Materialize.toast("Upload successfully", 4000);
    //                //    } else {
    //                //        Materialize.toast("Upload unsuccessfully", 4000);
    //                //    }
    //                //};
    //
    //                xhr.open("POST", uploadURL + file.name, false);
    //                xhr.send(file);
    //
    //                xhr.onreadystatechange = function () {
    //                    //if (xhr.readyState == 4) {
    //                    //    if (xhr.status == 200) {
    //                    //        console.log("upload complete");
    //                    //        console.log("response: " + xhr.responseText);
    //                    //        $("#progressBar").css("visibility", "hidden");
    //                    //    }
    //                    //}
    //                    if (xhr.response.successed) {
    //                        // File(s) uploaded.
    //                        Materialize.toast("Upload successfully", 4000);
    //                        $("#progressBar").css("visibility", "hidden");
    //                    } else {
    //                        Materialize.toast("Upload unsuccessfully", 4000);
    //                        $("#progressBar").css("visibility", "hidden");
    //                    }
    //                };
    //
    //                //console.log(files);
    //                //// try sending
    //                //for(var i=0;i<files.length;i++) {
    //                //  var file = files[i];
    //                //  var reader = new FileReader();
    //                //
    //                //  reader.onloadstart = function () {
    //                //    // 这个事件在读取开始时触发
    //                //    console.log("onloadstart");
    //                //    document.getElementById("bytesTotal").textContent = file.size;
    //                //    $("#progressBar").css("visibility", "visible");
    //                //  };
    //                //  reader.onprogress = function (p) {
    //                //    // 这个事件在读取进行中定时触发
    //                //    console.log("onprogress");
    //                //    document.getElementById("bytesRead").textContent = p.loaded;
    //                //  };
    //                //
    //                //  reader.onload = function () {
    //                //    // 这个事件在读取成功结束后触发
    //                //    console.log("load complete");
    //                //  };
    //                //
    //                //  reader.onloadend = function () {
    //                //    // 这个事件在读取结束后，无论成功或者失败都会触发
    //                //    if (reader.error) {
    //                //      console.log(reader.error);
    //                //    } else {
    //                //      document.getElementById("bytesRead").textContent = file.size;
    //                //      // 构造 XMLHttpRequest 对象，发送文件 Binary 数据
    //                //      for (var i = 0; i < files.length; i++) {
    //                //        //or use ajax
    //                //
    //                //        var xhr = new XMLHttpRequest();
    //                //        xhr.open(/* method */ "POST",
    //                //            /* target url */ "upload.jsp?fileName=" + file.name
    //                //            /*, async, default to true */);
    //                //        xhr.overrideMimeType("application/octet-stream");
    //                //        var zipBinaryBytes = new Uint8Array(reader.result.length);
    //                //        for (var i = 0; i < reader.result.length; ++i) {
    //                //          zipBinaryBytes[i] = reader.result.charCodeAt(i);
    //                //        }
    //                //        var zipBinary = new Blob([zipBinaryBytes], {type: 'application/zip'});
    //                //
    //                //        //sendData(zipBinary);
    //                //        xhr.send(zipBinary);
    //                //        console.log(zipBinary);
    //                //        xhr.onreadystatechange = function () {
    //                //          if (xhr.readyState == 4) {
    //                //            if (xhr.status == 200) {
    //                //              console.log("upload complete");
    //                //              console.log("response: " + xhr.responseText);
    //                //              $("#progressBar").css("visibility", "hidden");
    //                //            }
    //                //          }
    //                //        }
    //                //      }
    //                //    }
    //                //  };
    //                //  reader.readAsBinaryString(file);
    //                //}
    //            } else {
    //                alert("Please choose a file.");
    //                $("#uploadBtn").css("background-color", "#DFDFDF");
    //                $("#uploadBtn").css("color", "#9F9F9F");
    //            }
    //        }
    //    }
    //});
}

/**
 * ===========================================================================================
 *                                         Go back
 * ===========================================================================================
 */
function back() {
    console.log("back");
    if(currentPattern === "GS-AS-01") {
        overURL = urlMap.GS_AS_01.stop_updater_api;
    } else if(currentPattern = "GS_SR_01") {
        //overURL = urlMap.GS_AS_01.stop_updater_api;
    }
    $.ajax({
        url: overURL,
        type: "GET",
        success: function (data) {
            console.log(data);
        }
    });
    location.href = "selectModule.html";
}