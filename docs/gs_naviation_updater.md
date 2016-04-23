# updater web api
# 服务器地址：rms.gs-robot.me
## 型号映射表
  {
    "GS-AS-01":{
      "start_updater_api":"192.168.1.88:5678/gs-robot/cmd/start_system_updater",
      "stop_updater_api":"192.168.1.88:5678/gs-robot/cmd/stop_system_updater",
      "update_api":"192.168.1.88:6789/gs-robot/system/update_system/:file_name",
      "rollback_api":"192.168.1.88:6789/gs-robot/system/rollback"
    },
    "GS-SR-01":{
      @孙世超 使用时填写
    }
  }
## 获取更新包路径(后台)
### url
    rms.gs-robot.me/gs-updater-srv/system_deploy_packages/:robotModelType/:version GET
### param
    :robotModelType 扫地机：GS-AS-01 送餐车：？？？ 服务机器人：？？？
    ：version 最新：latest 指定版本：1.0.0
### response
    {
      "errorCode":"",
      "msg":"successed",
      "data":{
        "id":1,
        "version":"1.0.0",
        "name":"test",
        "pkg_file_url":"test.tar.gz",
        "created_at":"2016-12-12 12:12:12",
        "robot_model_type":"GS-AS-01"
      }
    }
## 下载更新包(后台)
### url
    download.gs-robot.me/system_deploy_package/:pkg_file_url GET
### param
    :pkg_file_url 从上个api获取
### response
    binary

## 启动机器人更新程序(hostname需要根据型号确定)(机器)
### url
    192.168.1.88:5678/gs-robot/cmd/start_system_updater GET
### response
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
## 停止机器人更新程序(hostname需要根据型号确定)(机器)
### url
    192.168.1.88:5678/gs-robot/cmd/stop_system_updater GET
### response
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }

## 上传部署包并更新系统(机器)
### url
    192.168.1.88:6789/gs-robot/system/update_system/:file_name POST
### param
    :file_name 上传的文件名
    body 文件
### response
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }

## 回滚到上一个版本(机器)
### url
    192.168.1.88:6789/gs-robot/system/rollback
### response
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
