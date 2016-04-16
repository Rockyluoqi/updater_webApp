///**
// * Created by Luoqi on 4/15/2016.
// */
///**
// * make some file to a new
// * @type {string[]}
// */
//var fileURLs = ['http://www.test.com/img.jpg',...];
//var zip = new JSZip();
//var count = 0;
//
//downloadFile(fileURLs[count], onDownloadComplete);
//
//
//function downloadFile(url, onSuccess) {
//  var xhr = new XMLHttpRequest();
//  xhr.onprogress = calculateAndUpdateProgress;
//  xhr.open('GET', url, true);
//  xhr.responseType = "blob";
//  xhr.onreadystatechange = function () {
//    if (xhr.readyState == 4) {
//      if (onSuccess) onSuccess(xhr.response);
//    }
//  }
//}
//
//function onDownloadComplete(blobData){
//  if (count < fileURLs.length) {
//    blobToBase64(blobData, function(binaryData){
//      // add downloaded file to zip:
//      var fileName = fileURLs[count].substring(fileURLs[count].lastIndexOf('/')+1);
//      zip.file(fileName, binaryData, {base64: true});
//      if (count < fileURLs.length -1){
//        count++;
//        downloadFile(fileURLs[count], onDownloadCompleted);
//      }
//      else {
//        // all files have been downloaded, create the zip
//        var content = zip.generate();
//
//        // then trigger the download link:
//        var zipName = 'download.zip';
//        var a = document.createElement('a');
//        a.href = "data:application/zip;base64," + content;
//        a.download = zipName;
//        a.click();
//      }
//    });
//  }
//}
//
//function blobToBase64(blob, callback) {
//  var reader = new FileReader();
//  reader.onload = function() {
//    var dataUrl = reader.result;
//    var base64 = dataUrl.split(',')[1];
//    callback(base64);
//  };
//  reader.readAsDataURL(blob);
//}
//
//function calculateAndUpdateProgress(evt) {
//  //if (evt.lengthComputable) {
//  //...
//  //}
//}
