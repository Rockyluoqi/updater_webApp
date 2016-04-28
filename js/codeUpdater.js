/**
 * download
 */
var request = require('request'),
    fs = require('fs'),
    url = require('url'),
    progress = require('request-progress'),
    mkdirp = require('mkdirp'),
    os = require('os'),
    dns = require('dns');

//default URLs
var downloadURL = "http://download.gs-robot.com/system_package/";
var getUpdatePathURL = "http://rms.gs-robot.com/gs-rms-svr/system_packages/";

var restoreURL = "http://192.168.1.88:6789/gs-robot/system/rollback";
var uploadURL = "http://192.168.1.88:6789/gs-robot/system/update_system/";
var beginURL = "http://192.168.1.88:5678/gs-robot/cmd/launch_system_updater";
var overURL = "http://192.168.1.88:5678/gs-robot/cmd/shutdown_system_updater";

var urlMap = {
    GS_AS_01: {
        start_updater_api: "http://192.168.1.88:5678/gs-robot/cmd/launch_system_updater",
        stop_updater_api: "http://192.168.1.88:5678/gs-robot/cmd/shutdown_system_updater",
        update_api: "http://192.168.1.88:6789/gs-robot/system/update_system/",
        rollback_api: "http://192.168.1.88:6789/gs-robot/system/rollback"
    },
    GS_SR_01:{
        start_updater_api: "http://192.168.1.88:8080/gs-robot/cmd/launch_system_updater",
        stop_updater_api: "http://192.168.1.88:8080/gs-robot/cmd/shutdown_system_updater",
        update_api: "http://192.168.1.88:8088/gs-robot/system/update_system/",
        rollback_api: "http://192.168.1.88:8088/gs-robot/system/rollback"
    }
    //GS_RR_01:{
    //
    //}
};

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
            document.getElementById('downloadProgress1').textContent = toDecimal2(state.percentage*100) + "%" + "  Speed: " + parseInt(state.speed/1024) +" KB/s";
        })
        .on('error', function (err) {
            console.log("download error: " + err);
            downloadError = true;
        })
        .on('end', function (response) {
            console.log(response);
            console.log("finish.....");
            $("#progressBar").css("visibility", "hidden");
            console.log(downloadError);
            $("#chooseFileBtn").css('visibility','visible');
            $("#uploadBtn").css('visibility','visible');
            if(!downloadError) {
                // Do something after request finishes
                Materialize.toast(file_name + toast, 4000);
                Materialize.toast(file_name + " is saved in firmware_download folder!", 8000);
            } else {
                //if user cancel the download action, it'll break the request and delete the incomplete file
                Materialize.toast(file_name + " download unsuccessfully!", 4000);
                out.end();
                console.log("delete file"+file_name);
                fs.unlinkSync('./firmware_download/' +file_name);
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
var patternList = ["GS-AS-01","GS-SR-01"];
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
    //patternList = [];
    //getPatternList();
    //console.log(patternList);

    //check if firmware_download is existed, if not it'll create a new folder
    fs.stat('./firmware_download', function (err, stat) {
        if (err === null) {
            //folder is existed do nothing
        } else {
            mkdirp('./firmware_download', function (err) {
                console.log(err);
            });
        }
    });

    selectPattern('list-content');
});

//function clearPatternList() {
//    var list = document.getElementById('listContainer');
//    list.innerHTML = "";
//}
var currentPattern ="";
document.getElementById('downloadSubmit').addEventListener('click', function () {
    $("#chooseFileBtn").css('visibility','hidden');
    $("#uploadBtn").css('visibility','hidden');
    $.ajax({
        type: "GET",
        url: "http://www.baidu.com",
        success: function(data){
            download();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(textStatus);
            if(textStatus == 'error') {
                Materialize.toast("Please connect to the Internet first!",10000);
            }
        }
    });
});

function download() {
    $("#progressBar").css("visibility", "visible");
    var robotPattern = $('input[name="group1"]:checked');
    currentPattern = robotPattern[0].value;
    $("#robotPattern").text("Robot pattern: "+currentPattern);
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if(xhr.status === 400) {
            $("#chooseFileBtn").css('visibility','visible');
            $("#uploadBtn").css('visibility','visible');
            $("#progressBar").css("visibility", "hidden");
            Materialize.toast("Download unsuccessfully (no latest update in the server)",10000);
        } else {
            var object = JSON.parse(xhr.response);
            console.log(object);
            if (object.msg === "successed") {
                Materialize.toast("Get UpdatePath successfully.", 4000);

                var ul = document.getElementById('listContainer');
                clearList();
                var li_1 = document.createElement('li');
                li_1.setAttribute('class', 'collection-item');
                var h = document.createElement('h5');
                h.textContent = "Downloading";
                li_1.appendChild(h);
                ul.appendChild(li_1);
                var li = document.createElement('li');
                li.setAttribute('class', 'collection-item');
                var div = document.createElement('div');
                div.setAttribute('id', 'list0');
                //div.textContent = files[i].name;
                div.textContent = object.data.pkg_file_url;
                var a = document.createElement('a');
                a.setAttribute('class', 'secondary-content');
                a.setAttribute('id', "downloadProgress1");
                a.textContent = "0%";

                var a_svg = document.createElement('a');
                a_svg.setAttribute('class', 'secondary-content');
                a_svg.setAttribute('id', "close1");
                a_svg.setAttribute('style', 'margin-left:20px');
                //a_svg.setAttribute('onclick','cancelAndDelete()');
                //Svg tag is not surpported
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

                document.getElementById('close1').addEventListener("click", cancelAndDelete);

                downloadFile(downloadURL + object.data.pkg_file_url, ' is downloaded !');
            } else {
                $("#progressBar").css("visibility", "hidden");
                Materialize.toast("Oops... Get UpdatePath unsuccessfully.", 4000);
            }
        }
    };
    xhr.open("GET", getUpdatePathURL + currentPattern + "/latest");
    xhr.setRequestHeader("desktop_web_access_key",sessionStorage.getItem("accessKey"));
    xhr.setRequestHeader("client_type","DESKTOP_WEB");
    xhr.send(null);
}

/**
 * function to break the request by making a error
 */
function cancelAndDelete() {
    var content = document.getElementById('listContainer');
    //This will make a error and the connection of downloading will break
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
document.getElementById('rollback').addEventListener('click', function () {
    if(currentPattern === "") {
        selectPattern('list-content-rollback');
        $('#patternListRollback').openModal();
    } else {
        restore();
    }
    ////删除目录下的所有文件
    //var files = getAllFiles('./download');
    //for (let value of files) {
    //    fs.unlinkSync(value);
    //}
    //
    //downloadFile(restoreURL, ' is restored !');

});

function restore() {
    var robotPattern = $('input[name="group1"]:checked');
    currentPattern = robotPattern[0].value;
    $("#robotPattern").text("Robot pattern: "+currentPattern);

    $("#progressBar").css("visibility", "visible");
    if (currentPattern === "GS-AS-01") {
        beginURL = urlMap.GS_AS_01.start_updater_api;
        restoreURL = urlMap.GS_AS_01.rollback_api;
    } else if (currentPattern = "GS_SR_01") {
        beginURL = urlMap.GS_SR_01.start_updater_api;
        restoreURL = urlMap.GS_SR_01.rollback_api;
    }

    if (beginURL != "") {
        $.ajax({
            type: "GET",
            url: beginURL,
            success: function (data) {
                request.get({url: beginURL}, function (err, httpResponse, body) {
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
                    }, 4000);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
                $("#progressBar").css("visibility", "hidden");
                Materialize.toast("Please connect to the robot WI-FI first!", 10000);
                if (textStatus == 'error') {
                    Materialize.toast("Please connect to the robot WI-FI first!", 10000);
                }
            }
        });
    } else {
        $("#progressBar").css("visibility", "hidden");
        Materialize.toast("You can't rollback now. Robot is not ready.", 10000);
    }
}

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
    var robotPattern = $('input[name="group1"]:checked');
    currentPattern = robotPattern[0].value;
    Materialize.toast("Please connect to the robot WI-FI before update", 8000);
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
        h.textContent = "Upload file list";
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

            //var a_svg = document.createElement('a');
            //a_svg.setAttribute('class', 'secondary-content');
            //a_svg.setAttribute('id', "close2");
            //a_svg.setAttribute('style','margin-left:20px');
            //
            //var img = document.createElement('img');
            //img.src = "css/icon/ic_cancel_black_24dp_1x.png";

            //a_svg.appendChild(img);
            //div.appendChild(a_svg);
            div.appendChild(a);
            div.appendChild(a1);
            li.appendChild(div);
            ul.appendChild(li);
            //document.getElementById('close2').addEventListener('click',cancelChooseFile);
        }
    } else {
        alert("Please choose a file.");
        $("#uploadBtn").css("background-color", "#DFDFDF");
        $("#uploadBtn").css("color", "#9F9F9F");
    }
});

document.getElementById("chooseFileBtn").addEventListener('click',function() {
    if(currentPattern === "") {
        selectPattern("list-content-upload");
        $('#patternListUpload').openModal();
    } else {
        var robotPattern = $('input[name="group1"]:checked');
        currentPattern = robotPattern[0].value;
        $("#robotPattern").text("Robot pattern: "+currentPattern);
        document.getElementById('fileID').click();
    }
});

document.getElementById('yesChoose').addEventListener('click',function() {
    var robotPattern = $('input[name="group1"]:checked');
    currentPattern = robotPattern[0].value;
    $("#robotPattern").text("Robot pattern: "+currentPattern);
    $('patternListUpload').closeModal();
    document.getElementById('fileID').click();
});

function selectPattern(listID) {
    var list = document.createElement("form");
    var content = document.getElementById(listID);
    content.innerHTML = "";
    var h = document.createElement("h4");
    h.textContent = "Select Robot";
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
        label.textContent = patternList[i];
        p.appendChild(input);
        p.appendChild(label);
        list.appendChild(p);
    }
    content.appendChild(list);
}

function cancelChooseFile() {
    var content = document.getElementById('list0');
    //when upload this will trigger a error and break the XHR
    content.innerHTML = "";
    Materialize.toast("Please choose file again", 4000);
    $("#uploadBtn").css("background-color", "#DFDFDF");
    $("#uploadBtn").css("color", "#9F9F9F");
}

function clearList() {
    var list = document.getElementById('listContainer');
    list.innerHTML = "";
}

function uploadAndSubmit() {
    event.preventDefault();
    //if(robotPattern === ) {
    //    beginURL = "";
    //}
    if(currentPattern === "GS-AS-01") {
        beginURL = urlMap.GS_AS_01.start_updater_api;
        uploadURL = urlMap.GS_AS_01.update_api;
    } else if(currentPattern = "GS_SR_01") {
        beginURL = urlMap.GS_SR_01.start_updater_api;
        uploadURL = urlMap.GS_SR_01.update_api;
    }

    if(beginURL != "") {
        //use ajax to check the internet connectivity
        $.ajax({
            type: "GET",
            url: beginURL,
            success: function (data) {
                //use request
                request.get({url: beginURL}, function (err, httpResponse, body) {
                    $("#progressBar").css("visibility", "visible");
                    setTimeout(function () {
                        console.log(httpResponse);
                        var object = JSON.parse(body);
                        console.log(object);
                        if (object.successed) {
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
                                    //$('#progress1').textContent = Math.round(done / total * 100) + '%';
                                    document.getElementById('progress1').textContent = Math.round(done / total * 100) + '%';
                                    if (done === total) {
                                        document.getElementById('progress1').textContent = "Decompressing and installing";
                                    }
                                });
                                // 请求完成时建立一个处理程序。
                                xhr.onload = function () {
                                    console.log(xhr.status);
                                    if (xhr.status == 200) {
                                        document.getElementById('progress1').textContent = "Update complete";
                                        Materialize.toast("Update successfully", 4000);
                                        Materialize.toast("If you want to use the updated features, please restart your robot.", 100000);
                                        $("#progressBar").css("visibility", "hidden");
                                    } else {
                                        document.getElementById('progress1').textContent = "Update unsuccessfully";
                                        Materialize.toast("Oops...Update unsuccessfully", 4000);
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
                    }, 4000);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(textStatus);
                $("#progressBar").css("visibility", "hidden");
                if (textStatus == 'error') {
                    Materialize.toast("Please connect to the robot WI-FI first!", 10000);
                }
            }
        });
    } else {
        $("#progressBar").css("visibility", "hidden");
        Materialize.toast("You can't update now. Robot is not ready.", 10000);
    }
}

/**
 * ===========================================================================================
 *                                          Go back
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