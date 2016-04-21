/**
 * download
 */

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
function downloadFile(fileName, urlData){
  //var aLink = document.createElement('a');
  //var evt = document.createEvent("HTMLEvents");
  //evt.initEvent("click");
  //aLink.download = fileName;
  //aLink.href = urlData;
  //aLink.dispatchEvent(evt);

  $("#progressBar").css("visibility", "visible");
  var request = require('request'),
      fs = require('fs'),
      zlib = require('zlib'),
      url = require('url');

  var file_name = url.parse(urlData).pathname.split('/').pop();
  console.log('filename: ' + file_name);
  var out = fs.createWriteStream('./download/' + file_name);

  var len;
  //use 'request'
  request
      .get(urlData)
      .on('response', function(response) {
        console.log(response.statusCode) // 200
        console.log(response.complete);
        console.log(response.headers['content-type']) // 'image/png'
        console.log(response.headers['content-length'])
        var len = response.headers['content-length'];
      })
      .pipe(out)
      .on('finish', function() {
        console.log("finish.....");
        $("#progressBar").css("visibility", "hidden");
        Materialize.toast(file_name +' is downloaded !', 4000);
      });
}

//var $upload = $('#upload');
//$upload.('change',onFileInputChange,false);
var patternList = [];
function getPatternList() {
  $.ajax({
    url:"",
    type:"get",
    dataType:"json",
    success: function(data) {
      if(data.successed) {
        patternList.push(data);
      }
    }
  });
}

document.getElementById('download').addEventListener('click', function () {
  patternList = [];
  getPatternList();

  var list = document.createElement("form");
  list.setAttribute('action', "#");
  for(var i=0;i<patternList.length;i++) {
    var p = document.createElement('p');
    var input = document.createElement('input');
    input.setAttribute('name', 'group1');
    input.setAttribute('type', 'radio');
    input.setAttribute('id', 'test' + i);
    var label = document.createElement('label');
    label.setAttribute('for', 'test' + i);
    label.appendChild(patternList[i]);
    p.appendChild(input);
    p.appendChild(label);
  }
});

document.getElementById('downloadSubmit').addEventListener('click',function() {
  var robotPattern = $('input[name="group1"]:checked').val();
  downloadFile(robotPattern,"url"+robotPattern+".zip");
});

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
      a.setAttribute('id', "progress" + i);
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
  var fileName = $("[name='file']#fileID").val().split('\\').pop();
  //var fileName= $("[name='file']#fileID").val();
  console.log(fileName);
  $("#progressBar").css("visibility", "visible");
  if (form["file"].files.length > 0) {

    // 寻找表单域中的 <input type="file" ... /> 标签
    var files = form["file"].files[0];

    var formData = new FormData();

    for(var i=0;i<files.length;i++) {
      var file = files[i];
      formData.append(file.name, file);
    }

    var xhr = new XMLHttpRequest();
    (xhr.upload || xhr).addEventListener('progress', function(e) {
      var done = e.position || e.loaded;
      var total = e.totalSize || e.total;
      console.log('xhr progress: ' + Math.round(done/total*100) + '%');

      //example update the progress data
      $('#progress1').innerText = Math.round(done/total*100) + '%';
    });
    // 请求完成时建立一个处理程序。
    xhr.onload = function () {
      if (xhr.status === 200) {
        // File(s) uploaded.
        uploadButton.innerHTML = 'Upload';
      } else {
        alert('An error occurred!');
      }
    };

    xhr.open();
    xhr.send(file);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log("upload complete");
          console.log("response: " + xhr.responseText);
          $("#progressBar").css("visibility", "hidden");
        }
      }
    };

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


/*function sendData(zipBinary) {
 var zipBinaryBytes = new Uint8Array(zipBinary.length);
 for (var i = 0; i < zipBinary.length; ++i) {
 zipBinaryBytes[i] = zipBinary.charCodeAt(i);
 }
 zipBinary = new Blob([zipBinaryBytes], { type: 'application/zip' });
 // rest of code as I suggested above...

 //fd.append('hello.zip', zipBinary);
 //xhr.onload = function() {
 //   Request completed! Use xhr.status and/or xhr.responseText to
 //   check the server's response status code and response body.
 //};
 //xhr.onerror = function() {
 //   Aw. Network error.
 //};
 //xhr.open('POST', 'https://example.com/');
 //xhr.send(fd);
 console.log(zipBinary);
 //xhr.send(new TextEncoder().encode(prefix+zipBinary+p))
 }*/
