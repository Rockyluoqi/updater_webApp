// button ripple effect from @ShawnSauce 's pen http://codepen.io/ShawnSauce/full/huLEH
$(document).ready(function() {
    var url = "http://rms.gs-robot.com/gs-rms-svr/customers/login";
    //document.getElementById('backBtn').addEventListener('click',function() {
    //    location.href = "selectModule.html";
    //});
    $(function(){
        const isReachable = require('is-reachable');

        isReachable(url, (err, reachable) => {
            console.log("reachable err log: "+err);
            console.log("reachable:?"+reachable);
            if(reachable) {
                //Materialize.toast("You can", 10000);
            } else {
                console.log();
                alert("You can't sign in now. Please check the net connection and try again!");
            }
            //console.log(reachable);
            //=> true
        });
        
        if(localStorage.getItem('isSignedIn')) {
            if(!ifNeedSignIn()) {
                location.href = 'selectModule.html';
            }
        }

        function ifNeedSignIn() {
            var oldTime = JSON.parse(localStorage.getItem('startTime'));
            var sessionTime = localStorage.getItem('sessionTime');
            console.log(sessionTime);

            var currentTime = new Date();
            var startTime = oldTime[0]+'-'+oldTime[1]+'-'+oldTime[2]+' '+oldTime[3]+':'+oldTime[4]+':'+oldTime[5];
            var endTime = currentTime.getFullYear() + '-' + (currentTime.getMonth() + 1) + '-' + currentTime.getDate() + ' ' + currentTime.getHours() + ':' + currentTime.getMinutes() + ':' + currentTime.getSeconds();

            return  getDateDiff(startTime,endTime,'second')*1000 > parseInt(sessionTime);
        }

        //GetDateDiff("2010-10-11 00:00:00", "2010-10-11 00:01:40", "seond")是计算秒数

        function getDateDiff(startTime, endTime, diffType) {
            //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
            startTime = startTime.replace(/\-/g, "/");
            endTime = endTime.replace(/\-/g, "/");
            //将计算间隔类性字符转换为小写
            diffType = diffType.toLowerCase();
            var sTime = new Date(startTime); //开始时间
            var eTime = new Date(endTime); //结束时间
            //作为除数的数字
            var divNum = 1;
            switch (diffType) {
                case "second":
                    divNum = 1000;
                    break;
                case "minute":
                    divNum = 1000 * 60;
                    break;
                case "hour":
                    divNum = 1000 * 3600;
                    break;
                case "day":
                    divNum = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
        }


        var animationLibrary = 'animate';

        $.easing.easeOutQuart = function (x, t, b, c, d) {
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
        };
        $('[ripple]:not([disabled],.disabled)')
            .on('mousedown', function( e ){

                var button = $(this);
                var touch = $('<touch><touch/>');
                var size = button.outerWidth() * 1.8;
                var complete = false;

                $(document)
                    .on('mouseup',function(){
                        var a = {
                            'opacity': '0'
                        };
                        if( complete === true ){
                            size = size * 1.33;
                            $.extend(a, {
                                'height': size + 'px',
                                'width': size + 'px',
                                'margin-top': -(size)/2 + 'px',
                                'margin-left': -(size)/2 + 'px'
                            });
                        }

                        touch
                            [animationLibrary](a, {
                            duration: 500,
                            complete: function(){touch.remove();},
                            easing: 'swing'
                        });
                    });

                touch
                    .addClass( 'touch' )
                    .css({
                        'position': 'absolute',
                        'top': e.pageY-button.offset().top + 'px',
                        'left': e.pageX-button.offset().left + 'px',
                        'width': '0',
                        'height': '0'
                    });

                /* IE8 will not appendChild */
                button.get(0).appendChild(touch.get(0));

                touch
                    [animationLibrary]({
                    'height': size + 'px',
                    'width': size + 'px',
                    'margin-top': -(size)/2 + 'px',
                    'margin-left': -(size)/2 + 'px'
                }, {
                    queue: false,
                    duration: 500,
                    'easing': 'easeOutQuart',
                    'complete': function(){
                        complete = true
                    }
                });
            });
    });

    var username = $('#username'),
        password = $('#password'),
        erroru = $('erroru'),
        errorp = $('errorp'),
        submit = $('#submit'),
        udiv = $('#u'),
        pdiv = $('#p');

    username.blur(function() {
        if (username.val() == '') {
            udiv.attr('errr','');
        } else {
            udiv.removeAttr('errr');
        }
    });

    password.blur(function() {
        if(password.val() == '') {
            pdiv.attr('errr','');
        } else {
            pdiv.removeAttr('errr');
        }
    });

    submit.on('click', function(event) {
        event.preventDefault();
        if (username.val() == '') {
            udiv.attr('errr','');
        } else {
            udiv.removeAttr('errr');
        }
        if(password.val() == '') {
            pdiv.attr('errr','');
        } else {
            pdiv.removeAttr('errr');
        }
        var param = {
            email:username.val(),
            password:password.val()
        };

        $.ajax({
            url:"http://rms.gs-robot.com/gs-rms-svr/customers/login",
            type:"POST",
            dataType:"json",
            data: JSON.stringify(param),
            //async:false,
            success:function(data) {
                console.log(data);
                var sessionExpirationTime = data.data.sessionExpirationTime;
                localStorage.setItem('sessionTime',sessionExpirationTime);

                if(data.errorCode === "") {
                    var currentDate = new Date();
                    console.log(currentDate);
                    var dateArray = [];

                    dateArray.push(currentDate.getFullYear());
                    dateArray.push(currentDate.getMonth()+1);
                    dateArray.push(currentDate.getDate());
                    dateArray.push(currentDate.getHours());
                    dateArray.push(currentDate.getMinutes());
                    dateArray.push(currentDate.getSeconds());

                    localStorage.setItem('startTime',JSON.stringify(dateArray));


                    localStorage.setItem("accessKey",data.data.accessKey);
                    location.href = "selectModule.html";
                    sessionStorage.setItem("isSignedIn","true");
                    localStorage.setItem("isSignedIn","true");
                }
            }
        });

        //if(username.val() === "123" && password.val() === "321") {
        //  location.href = "../codeUpdater.html";
        //}
    });
});
