import "./screen.css";

import ui from "soonui";
import "../../../common/x-map/x-map";
import { createLayout } from "../../../common/screen/screen";
import { createElement, css } from "../../../common/html/html-utils";
import { pageSettings, pageInit, bodyAppend } from "../../../common/layout/screen-layout";

pageSettings({
    title: "SCREEN",
    header: "SOON.UI SCREEN",
    headerWidth: 360,
    leftIconButtons: [
        {
            id: "mapLayer",
            text: "图层控制",
            icon: "<i class='fas fa-th-large'></i>",
            toggle: true,
            handler: checked => ui.messageShow(["mapLayer", checked])
        },
        {
            id: "mapChange",
            text: "底图切换",
            icon: "<i class='fas fa-map'></i>",
            change: ["fa-map", "fa-plus"],
            handler: e => {}
        },
        {
            id: "map3DChange",
            text: "三维切换",
            icon: "<i class='fas fa-cube'></i>",
            change: ["fa-cube", "fa-stop"],
            handler: e => {}
        }
    ],
    rightIconButtons: [
        {
            id: "home",
            text: "回到原点",
            icon: "<i class='fas fa-home'></i>",
            handler: e => ui.messageShow("home")
        },
        {
            id: "fullScreen",
            text: "全屏",
            icon: "<i class='fas fa-arrows-alt'></i>",
            toggle: true,
            handler: checked => ui.messageShow(["fullScreen", checked])
        },
        {
            id: "navigator",
            text: "导航",
            icon: "<i class='fas fa-bars'></i>",
            toggle: true,
            handler: checked => ui.messageShow(["navigator", checked])
        }
    ]
});

pageInit({
    created() {
        // 创建地图图层面板
        //this.layerManager = createLayerManager(this.map);

        this.centerPanel = createCenterPanel();
        this.panelManager = createPanelManager();
    },
    layout() {
        const width = this.contentBodyWidth;
        const height = this.contentBodyHeight;

        this.panelManager.arrange(width, height, this.panelManagerResizeFlag);
        this.panelManagerResizeFlag = true;

        this.centerPanel.restore();
    },
    load() {
        this.panelManager.show();
        this.centerPanel.show();
    }
});

function createLayerManager() {

}

function createCenterPanel() { 
    const element = createElement("div");
    element.id = "centerPanel";
    css(element, {
        width: "100%",
        height: "100%",
        overflow: "hidden"
    });
    
    const panel = new ui.xmap.MapDialog({
        parent: ui.page.body,
        show: "up",
        done: "down",
        hide: "down",
        title: "中心区域",
        top: ui.page.headerHeight,
        suitable: false,
        resizeable: false,
        draggable: false,
        autoPosition: false,
        boxCtrls: false
    }, element);

    panel.restore = function() {
        const parentWidth = ui.page.contentBodyWidth;
        const parentHeight = ui.page.contentBodyHeight;

        const width = parentWidth 
            - (ui.page.panelManager.getLeftFenceWidth() + ui.page.panelMarginValue)
            - (ui.page.panelManager.getRightFenceWidth() + ui.page.panelMarginValue);
        const height = parentHeight - ui.page.panelMarginValue * 2;

        this.setSize(width, height, parentWidth, parentHeight);
    }

    return panel;
}

function createPanelManager() {
    const panelManager = createLayout({
        container: ui.page.body,
        layoutTop: 0,
        layoutBottom: ui.page.panelMarginValue,
        panelMargin: ui.page.panelMarginValue
    });
    panelManager
        .leftFence(320, false)
        .rightFence(320, false);

    // 左边
    createChartPiePanel(panelManager);
    createChartLinePanel(panelManager);
    createDevicePanel(panelManager);

    // 右边
    createChartBarPanel(panelManager);
    createAlarmPanel(panelManager);

    return panelManager;
}

function createChartPiePanel(panelManager) {
    let alarms = ["库区报警", "温度报警"];
    let values = [];

    alarms.forEach(function(alarm) {
        values.push({
            name: alarm,
            value: ui.random.getNum(25, 150)
        });
    });

    ui.page.chartPiePanel = ui.screen.module.LayoutChartPiePanel({
        panelManager: panelManager,
        name: "chartPiePanel",
        group: "Left",
        title: "饼图",
        flexibleHeight: 2,
        categoryColumn: "name",
        valueColumn: "value",
        chartColors: ["#4BD9FF", "#FE5A3E"],
        viewData: values
    });
}

function createChartLinePanel(panelManager) {
    var alarms = ["设备位移","设备倒地","设备警告","设备低电","设备掉线"],
        week = ["一","二","三","四","五","六","日"],
        weekValues = [];

    alarms.forEach(function(alarm) {
        week.forEach(function(w) {
            weekValues.push({
                name: w,
                group: alarm,
                value: ui.random.getNum(25, 150)
            });
        });
    });

    ui.page.chartLinePanel = ui.screen.module.LayoutChartLinePanel({
        panelManager: panelManager,
        name: "chartLinePanel",
        group: "Left",
        title: "折线图",
        flexibleHeight: 2,
        categoryColumn: "name",
        groupColumn: "group",
        valueColumn: "value",
        viewData: weekValues
    });
} 

function createDevicePanel(panelManager) {
    ui.page.devicePanel = ui.screen.module.LayoutTabPanel({
        panelManager: panelManager,
        name: "DevicePanel",
        group: "Left",
        flexibleHeight: 1,
        tabs: [
            { title: "Tab1", body: createElement("div") },
            { title: "Tab2", body: createElement("div") },
            { title: "Tab3", body: createElement("div") }
        ]
    });
}

function createChartBarPanel(panelManager) {
    let value = [];
    let titles = ["仓库报警", "库区报警", "温度报警", "湿度报警", "门禁报警"];

    titles.forEach(function(item, index) {
        value.push({
            name: item,
            value: ui.random.getNum(30, 100)
        });
    });

    ui.page.chartBarPanel = ui.screen.module.LayoutChartBarPanel({
        panelManager: panelManager,
        name: "chartBarPanel",
        group: "Right",
        title: "柱状图",
        flexibleHeight: 2,
        categoryColumn: "name",
        valueColumn: "value",
        viewData: value
    });
}

function createAlarmPanel(panelManager) {
    let roads = ["一号库区","二号库区","303库房","504库房","主门外侧","西区20米"];
    let alarmTypes = ["库区报警", "门禁报警", "库房报警", "温度报警", "湿度报警"];

    function getAlarms() {
        let i, len = ui.random.getNum(0, 5);
        let alarms = [];

        for(i = 0; i < len; i++) {
            let alarm = {
                id: ui.random.uuid(),
                level: ui.random.getNum(1, 5),
                address: roads[ui.random.getNum(0, roads.length)],
                event: alarmTypes[ui.random.getNum(0, alarmTypes.length)]
            };
            alarm.message = "【" + alarm.event + "】" + "在" + alarm.address + "出现预警事件";
            alarms.push(alarm);
        }
        return alarms;
    }

    ui.page.alarmPanel = ui.screen.module.LayoutMessagePanel({
        panelManager: panelManager,
        name: "AlarmPanel",
        group: "Right",
        title: "实时信息列表",
        itemKey: "uniqueId",
        flexibleHeight: 8,
        maxLength: 50
    });

    ui.page.alarmPanel.shown(function(e) {
        var that = this;
        function add() {
            var alarms = getAlarms();
            that.setViewData(alarms);
            setTimeout(add, ui.random.getNum(1000, 5000))
        }
        setTimeout(function() {
            add();
        }, ui.random.getNum(1000, 5000));
    });
    ui.page.alarmPanel.messageclick(function(e, eventData) {
        var item = eventData.itemData;
        alert([item.message, item.level, item.id]);
    });
}