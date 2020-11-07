import style from "./home.css";

import ui from "soonui";
import { pageSettings, pageInit, bodyAppend } from "../../common/layout/layout-master";

pageSettings({
    title: "HOME",
    header: "SOON.UI HOME"
});

pageInit({
    created() {
        this.tileContainer = createTiles();
        bodyAppend(this.tileContainer.container);
    },
    layout() {
        this.tileContainer.layout(
            this.contentBodyWidth, this.contentBodyHeight);
    }
});

function createTiles() {
    const tileColor = "rgba(255, 255, 255, .4)";
    const tileIcon = "/content/icon/tile/Settings.png";

    const tileContainer = ui.TileContainer(document.createElement("div"));
    tileContainer.addGroup("常用", [
        { type: "large", color: tileColor, title: "天气", icon: tileIcon, name: "weather", interval: 5, updateFn: updateWeather },
        { type: "wide", color: tileColor, title: "日期", icon: tileIcon, name: "date", interval: 1, updateStyle: "moveup", updateFn: ui.tiles.calendar },
        { type: "wide", color: tileColor, title: "时间", icon: tileIcon, name: "time", interval: 1, updateFn: ui.tiles.clock },
        { type: "small", color: tileColor, title: "bing", icon: tileIcon, link: "http://cn.bing.com" },
        { type: "small", color: tileColor, title: "baidu", icon: tileIcon, link: "http://www.baidu.com" },
        { type: "small", color: tileColor, title: "microsoft", icon: tileIcon },
        { type: "small", color: tileColor, title: "google", icon: tileIcon },
        { type: "medium", color: tileColor, title: "浏览器", icon: tileIcon },
        { type: "medium", color: tileColor, title: "manage", icon: tileIcon, link: "./manage.html" },
        { type: "medium", color: tileColor, title: "机票打印", icon: tileIcon },
        { type: "medium", color: tileColor, title: "度假", icon: tileIcon },
        { type: "medium", color: tileColor, title: "请假单", icon: tileIcon }
    ]);
    tileContainer.addGroup("日常工作", [
        { type: "wide", color: tileColor, title: "工时记录", icon: tileIcon },
        { type: "medium", color: tileColor, title: "工时查询", icon: tileIcon },
        { type: "medium", color: tileColor, title: "工时确认", icon: tileIcon },
        { type: "large", color: tileColor, title: "Message", icon: tileIcon },
        { type: "wide", color: tileColor, title: "考勤信息", icon: tileIcon },
        { type: "wide", color: tileColor, title: "考勤打印", icon: tileIcon }
    ]);
    tileContainer.addGroup("项目管理", [
        { type: "wide", color: tileColor, title: "用户", icon: tileIcon },
        { type: "small", color: tileColor, title: "机构", icon: tileIcon },
        { type: "small", color: tileColor, title: "部门", icon: tileIcon },
        { type: "small", color: tileColor, title: "职位", icon: tileIcon },
        { type: "small", color: tileColor, title: "人力成本", icon: tileIcon },
        { type: "medium", color: tileColor, title: "员工统计", icon: tileIcon },
        { type: "large", color: tileColor, title: "项目", icon: tileIcon },
        { type: "wide", color: tileColor, title: "项目统计", icon: tileIcon },
        { type: "medium", color: tileColor, title: "资源分布", icon: tileIcon },
        { type: "medium", color: tileColor, title: "成本统计", icon: tileIcon }
    ]);
    tileContainer.addGroup("系统设置", [
        { type: "wide", color: tileColor, title: "菜单", icon: tileIcon },
        { type: "medium", color: tileColor, title: "设置", icon: tileIcon },
        { type: "medium", color: tileColor, title: "字典管理", icon: tileIcon },
        { type: "wide", color: tileColor, title: "登录图片", icon: tileIcon, name: "loginImage", interval: 1, updateFn: picturePlay }
    ]);

    return tileContainer;
}

function updateWeather(tile) {
    var weatherData,
        i, len,
        today,
        date;
    weatherData = {
        cityName: "南京",
        days: [
            { date: null, type: "1", temperature: 23, low: 19, high: 25, description: "阵雨转多云", windDirection: "东南风转西北风，3级" },
            { date: null, type: "1", temperature: null, low: 20, high: 28, description: "晴", windDirection: "东南风转西北风，3级" },
            { date: null, type: "1", temperature: null, low: 20, high: 28, description: "多云", windDirection: "东南风转西北风，3级" },
            { date: null, type: "1", temperature: null, low: 20, high: 27, description: "多云转阴", windDirection: "东南风转西北风，3级" },
            { date: null, type: "1", temperature: null, low: 22, high: 26, description: "阵雨", windDirection: "东南风转西北风，3级" },
            { date: null, type: "1", temperature: null, low: 21, high: 26, description: "阵雨", windDirection: "东南风转西北风，3级" }
        ]
    };
    today = new Date();
    for(i = 0, len = weatherData.days.length; i < len; i++) {
        date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        weatherData.days[i].date = ui.date.format(date, "yyyy-MM-dd") + "T00:00:00";
    }
    ui.tiles.weather(tile, weatherData);
}

function picturePlay(tile) {
    var images = [
        "/content/image/picture/1.jpg",
        "/content/image/picture/5.jpg",
        "/content/image/picture/12.jpg",
        "/content/image/picture/20.jpg",
        "/content/image/picture/27.jpg"
    ];
    ui.tiles.picture(tile, images);
}