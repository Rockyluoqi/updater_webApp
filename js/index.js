/**
 * download
 */

  //get pattern list at the first time
  var patternList = [];
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


  $('.modal-trigger').leanModal();

//document.getElementById("download").addEventListener('click',function(e) {
//  e.preventDefault();
//
//  //downloadFile('data.zip','http://192.168.1.105:8080/gs-robot/data/map_png?map_name=ssc6');
//  downloadFile('data.zip','https://github.com/Rockyluoqi/algs4/archive/master.zip');
//
//  //var xhr = new XMLHttpRequest();
//  //xhr.open("POST", baseURLDownload + "/service/report/QCPReport", true);
//  //xhr.setRequestHeader("Content-type","application/json");
//  //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
//  //xhr.onreadystatechange = function() {
//  //  if (xhr.readyState == 4 && xhr.status == 200) {
//  //    // alert("Failed to download:" + xhr.status + "---" + xhr.statusText);
//  //    var blob = new Blob([xhr.response], {type: "octet/stream"});
//  //    var fileName = "QCPReport.zip";
//  //    saveAs(blob, fileName);
//  //  }
//  //}
//  //xhr.responseType = "arraybuffer";
//  //xhr.send(JSON.stringify(QCPParameter));
//
//  //$.fileDownload('http://192.168.1.105:8080/gs-robot/data/map_png?map_name=ssc6');
//  //$.fileDownload('http://192.168.1.105:8080/gs-robot/data/map_png?map_name=ssc6',{
//  //  successCallback: function(url) {
//  //    alert('You just got a file download dialog or ribbon for this URL :' + url);
//  //  },
//  //  failCallback: function(html,url) {
//  //    alert('Your file download just failed for this URL:' + url + '\r\n' +
//  //      'Here was the resulting error HTML: \r\n' + html
//  //    );
//  //  }
//  //});
//});
//
function downloadFile(fileName, urlData){
  var aLink = document.createElement('a');
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click");
  aLink.download = fileName;
  aLink.href = urlData;
  aLink.dispatchEvent(evt);
}

//var xhr = new XMLHttpRequest();
//xhr.open("POST", baseURLDownload + "/service/report/QCPReport", true);
//xhr.setRequestHeader("Content-type","application/json");
//xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
//xhr.onreadystatechange = function() {
//  if (xhr.readyState == 4 && xhr.status == 200) {
//    // alert("Failed to download:" + xhr.status + "---" + xhr.statusText);
//    var blob = new Blob([xhr.response], {type: "octet/stream"});
//    var fileName = "QCPReport.zip";
//    saveAs(blob, fileName);
//  }
//}
//xhr.responseType = "arraybuffer";
//xhr.send(JSON.stringify(QCPParameter));


//downloadFile('urlName', 'url');

//var $upload = $('#upload');
//$upload.('change',onFileInputChange,false);

  document.getElementById('download').addEventListener('click', function () {
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

$('input[type=file]').change(function() {
  var form = document.forms["uploadForm"];
  if (form["file"].files.length > 0) {
    $("#uploadBtn").css("background-color", "#2196F3");
    $("#uploadBtn").css("color", "#FFFFFF");
    var files = form["file"].files;
    var ul = document.getElementById('listContainer');

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

  function uploadAndSubmit() {
    var form = document.forms["uploadForm"];
    var fileName = $("[name='file']#fileID").val().split('\\').pop();
    //var fileName= $("[name='file']#fileID").val();
    console.log(fileName);
    if (form["file"].files.length > 0) {

      // 寻找表单域中的 <input type="file" ... /> 标签
      var file = form["file"].files[0];
      var files = form["file"].files;

      console.log(files);
      // try sending
      var reader = new FileReader();

      reader.onloadstart = function () {
        // 这个事件在读取开始时触发
        console.log("onloadstart");
        document.getElementById("bytesTotal").textContent = file.size;
        $("#progressBar").css("visibility", "visible");
      };
      reader.onprogress = function (p) {
        // 这个事件在读取进行中定时触发
        console.log("onprogress");
        document.getElementById("bytesRead").textContent = p.loaded;
      };

      reader.onload = function () {
        // 这个事件在读取成功结束后触发
        console.log("load complete");
      };

      reader.onloadend = function () {
        // 这个事件在读取结束后，无论成功或者失败都会触发
        if (reader.error) {
          console.log(reader.error);
        } else {
          document.getElementById("bytesRead").textContent = file.size;
          // 构造 XMLHttpRequest 对象，发送文件 Binary 数据
          for(var i=0;i<files.length;i++) {
            //use ajax

            var xhr = new XMLHttpRequest();
            xhr.open(/* method */ "POST",
              /* target url */ "upload.jsp?fileName=" + file.name
              /*, async, default to true */);
            xhr.overrideMimeType("application/octet-stream");
            var zipBinaryBytes = new Uint8Array(reader.result.length);
            for (var i = 0; i < reader.result.length; ++i) {
              zipBinaryBytes[i] = reader.result.charCodeAt(i);
            }
            var zipBinary = new Blob([zipBinaryBytes], {type: 'application/zip'});

            //sendData(zipBinary);
            xhr.send(zipBinary);
            console.log(zipBinary);
            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  console.log("upload complete");
                  console.log("response: " + xhr.responseText);
                  $("#progressBar").css("visibility", "hidden");
                }
              }
            }
          }

        }
      };
      reader.readAsBinaryString(file);
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
