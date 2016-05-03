/**
 * Created by Luoqi on 4/29/2016.
 */
var fs = require("fs");
function readConfig() {
    fs.readFile("./ipConfig.json","utf-8",function(error, fileData){
        console.log("error "+error);

        var object = JSON.parse(fileData);
        console.log("IP: "+object.ip);
        localStorage.setItem('ip',object.ip);
    });
}

var ip = localStorage.getItem('ip');
var checkURL =
function checkEditorModule() {
    $.ajax({
        url:checkURL,
        type:"GET",
        dataType:'json',
        success:function(data){
            console.log(data);
            $("#mapEditor").css("visibility", "visible");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("check connection response: "+textStatus);
            $("#mapEditor").css("visibility", "hidden");
            if (textStatus == 'error') {
                Materialize.toast("You can't edit map now. Please check the net connection.", 10000);
            }
        }
    });
}


readConfig();
checkEditorModule();