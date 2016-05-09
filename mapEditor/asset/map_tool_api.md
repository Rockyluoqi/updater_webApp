# 地图编辑工具api
## 地图选择页面api
- 地图列表 /gs-robot/data/maps
- respose:
    {
      "successed":true,
      "errorCode":""
      "msg":"",
      "data":[{
            "createdAt":"2016-03-28 14:21:49",
            "id":0,
            "mapInfo":{
                "gridHeight":992,
                "gridWidth":992,
                "originX":-24.8,
                "originY":-24.8,
                "resolution":0.05000000074505806
            },
            "name":"office"
        },
        {
            "createdAt":"2016-03-25 14:49:46",
            "id":0,
            "mapInfo":{
                "gridHeight":992,
                "gridWidth":992,
                "originX":-24.8,
                "originY":-24.8,
                "resolution":0.05000000074505806
            },
            "name":"office1"
        }]
    }
- 地图png /gs-robot/data/map_png?map_name=?
- response stream
- 地图上的初始点 /gs-robot/data/init_points?map_name=?
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"",
      "data":[{
          "angle":-0.100000000018768,  // 角度
          "createdAt":"2016-03-24 11:20:27",
          "gridX":493,  // 栅格化的坐标x(是针对某个地图来说的)
          "gridY":495,  // 栅格化的坐标y
          "id":0,
          "mapId":0,
          "mapName":"office",   // 属于哪个地图
          "name":"Origin",      // 初始点名称
          "pose":{ 
              "orientation":{
                  "w":0.9999996192282494,
                  "x":0,
                  "y":0,
                  "z":-0.0008726645152350998
              },
              "position":{
                  "x":-0.12000000000000033,
                  "y":4.440892098500626e-16,
                  "z":0
              }
          },
          "type":0   // type: 0:正常初始点　1:充电点
        }]
    }
- 地获取更新图上的点的信息 /gs-robot/data/positions?map_name=?
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":[{
                "angle":-55,
                "createdAt":"2016-03-28 16:29:15",
                "gridX":468,
                "gridY":512,
                "id":0,
                "mapId":0,
                "mapName":"office",
                "name":"origin",
                "type":1,
                "worldPose":{
                    "orientation":{
                        "w":0.8833518747821021,
                        "x":0,
                        "y":0,
                        "z":-0.46871042800320273
                    },
                    "position":{
                        "x":-1.3560470612974633,
                        "y":0.8420357413205513,
                        "z":0
                    }
                }
              }]
    }
## 地图编辑页面
- 获取Virtual Obstacle /gs-robot/data/virtual_obstacles
- 更新Virtual Obstacle /gs-robot/cmd/update_virtual_obstacles
- 添加初始点 /gs-robot/cmd/init_point/add_init_point
- request:
    {
      "angle":-55,
      "gridX":468,
      "gridY":512,
      "mapName":"office",
      "name":"origin",
      "type":1
    }
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
- 删除初始点 /gs-robot/cmd/delete_init_point?map_name=?&init_point_name=?
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
- 添加坐标点 /gs-robot/cmd/position/add_position
- request:
    {
      "angle":-55,
      "gridX":468,
      "gridY":512,
      "mapName":"office",
      "name":"origin",
      "type":1
    }
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
- 删除坐标点 /gs-robot/cmd/delete_position?map_name=?&position_name=?
- response:
    {
      "successed":true,
      "errorCode":"",
      "msg":"successed",
      "data":""
    }
