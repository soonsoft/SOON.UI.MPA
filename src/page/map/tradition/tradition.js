import "./tradition.css";

import ui from "soonui";
import "../../../common/x-map/x-map";
import { createLayout } from "../../../common/screen/screen";
import { addClass, append, createElement, on, removeClass, text } from "../../../common/html/html-utils";
import { pageSettings, pageInit, bodyAppend, toolPanelResize } from "../../../common/layout/map-layout";

pageSettings({
    title: "X-MAP",
    header: "SOON.UI X-MAP",
    showHomeButton: true,
    tools: [
        {
            isRight: false,
            buttons: [
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
                    id: "switchMap",
                    text: "底图切换",
                    icon: "<i class='fas fa-map'></i>",
                    change: ["fa-map", "fa-plus"],
                    handler: e => {}
                }
            ]
        },
        {
            isRight: false,
            buttons: [
                {
                    id: "mapLayer",
                    text: "图层控制",
                    icon: "<i class='fas fa-list-ul'></i>",
                    toggle: true,
                    handler: (checked, action) => action(ui.page.layerManager)
                },
                {
                    id: "mapTools",
                    text: "工具",
                    icon: "<i class='fas fa-cogs'></i>",
                    toggle: true,
                    handler: (checked, action) => action(ui.page.toolMenuList)
                },
                {
                    id: "lightAdjuster",
                    text: "亮度调节",
                    icon: "<i class='far fa-adjust'></i>",
                    toggle: true,
                    handler: (checked, action) => action(ui.page.lightAdjuster)
                }
            ]
        },
        {
            isrRight: false,
            buttons: [
                {
                    id: "tableBox",
                    text: "表格对话框",
                    icon: "<i class='far fa-table'></i>",
                    toggle: true,
                    handler: checked => checked ? ui.page.tableBox.show() : ui.page.tableBox.hide()
                },
                {
                    id: "pictureBox",
                    text: "图片对话框",
                    icon: "<i class='far fa-image'></i>",
                    toggle: true,
                    handler: checked => checked ? ui.page.pictureBox.show() : ui.page.pictureBox.hide()
                }
            ]
        }
    ]
});

pageInit({
    menu: true,
    created() {
        // 创建地图图层面板
        this.layerManager = createLayerManager();
        // 创建地图工具菜单
        this.toolMenuList  = createToolMenuList();
        // 创建底图亮度调节器
        this.lightAdjuster = createMapLightAdjust(this.map);
        
        // 地图浮动面板
        this.panelManager = createPanelManager();

        // 表格对话框
        this.tableBox = createGridDialog();
        // 图片对话框
        this.pictureBox = createPictureDialog();

    },
    layout() {
        const width = this.contentBodyWidth;
        const height = this.contentBodyHeight;

        this.panelManager.arrange(width, height, this.panelManagerResizeFlag);
        this.panelManagerResizeFlag = true;

        toolPanelResize();
    },
    load() {
        loadMenuData();
        this.panelManager.show();
    }
});

//#region 工具栏

/** 创建图层管理 */
function createLayerManager() {
    const layerManager = new ui.xmap.MapLayerPanel({
        container: ui.page.body,
        top: ui.page.panelMarginValue,
        left: 0,
        height: 300,
        viewData: [
            { layerId: "restaurant", layerName: "美食", checked: true },
            { layerId: "cinema", layerName: "电影院", checked: true },
            { layerId: "ktv", layerName: "KTV", checked: true }
        ]
    });
    layerManager.hiding(e => {
        removeClass(document.getElementById("mapLayer"), ui.page.mapButtonActive);
    });
    layerManager.checked((e, layers) => {
        ui.messageShow(layers[0] + "，显示");
    });
    layerManager.unchecked((e, layers) => {
        ui.messageShow(layers[0] + "，隐藏");
    });

    return layerManager;
}

/** 创建地图工具菜单 */
function createToolMenuList() {
    var menuList = new ui.xmap.MapMenuList({
        height: 152,
        right: 152,
        container: ui.page.mapContainer,
        menus: [{
                icon: "fa-magic",
                text: "测距",
                handler: function() {
                }
            },
            {
                icon: "fa-retweet",
                text: "测面",
                handler: function() {
                }
            },
            {
                icon: "fa-eraser",
                text: "清除",
                handler: function() {
                }
            }
        ]
    });
    menuList.hiding(function(e) {
        removeClass(document.getElementById("mapTools"), ui.page.mapButtonActive);
    });
    return menuList;
}

/** 创建底图亮度调节器 */
function createMapLightAdjust(map) {
    var adjuster = new ui.xmap.MapLightAdjust({
        value: 100,
        container: ui.page.mapContainer,
        map: map
    });
    adjuster.hiding(function(e) {
        removeClass(document.getElementById("lightAdjuster"), ui.page.mapButtonActive);
    });
    return adjuster;
}

//#endregion

//#region 地图浮动元素

// 初始化布局容器
function createPanelManager() {
    const panelManager = createLayout({
        container: ui.page.mapContainer,
        layoutTop: 48,
        layoutBottom: 52,
        panelMargin: 20
    });
    panelManager.rightFence(260, false);

    createCtrlPanel(panelManager);
    createTabListPanel(panelManager);

    return panelManager;
}

function createCtrlPanel(panelManager) {
    ui.page.ctrlPanel = ui.screen.module.LayoutCtrlPanel({
        panelManager: panelManager,
        title: "控制面板",
        name: "CtrlPanel",
        group: "Right",
        width: 240,
        height: 248,
        buttons: [
            {
                id: "temperature",
                text: "温度",
                group: "热普图",
            },
            {
                id: "humidity",
                text: "湿度",
                group: "热普图",
            },
            {
                id: "freeze",
                text: "结冰",
                group: "热普图",
            },
            {
                id: "fog",
                text: "大雾",
                group: "热普图",
            },
            {
                id: "rain",
                text: "降水",
                group: "雷达图",
            }
        ]
    });
}

function createTabListPanel(panelManager) {
    ui.page.tabListPanel = ui.screen.module.LayoutTabListPanel({
        panelManager: panelManager,
        name: "TabListPanel",
        group: "Right",
        flexibleHeight: 2,
        width: 240,
        listOptions: [
            {
                title: "美食",
                icon: "fa-home",
                nameField: "name",
                listName: "restaurant",
                selectedHandler: (eventData, list) => {
                    list.setHeadText(eventData.itemData.name);
                },
                loadHandler: list => {
                    list.setViewData([
                        { name: "肯德基" },
                        { name: "麦当劳" },
                        { name: "必胜客" },
                        { name: "赛百味" },
                        { name: "豪客来" }
                    ]);
                }
            },
            {
                title: "酒店",
                icon: "fa-home",
                nameField: "name",
                listName: "hotel",
                selectedHandler: (eventData, list) => {
                    list.setHeadText(eventData.itemData.name);
                },
                loadHandler: list => {
                    list.setViewData([
                        { name: "金斯利喜来登大酒店" },
                        { name: "希尔顿大酒店" },
                        { name: "皇冠假日酒店" },
                        { name: "帆船酒店" },
                        { name: "温泉酒店" }
                    ]);
                }
            }
        ]
    });
}

//#endregion

//#region 对话框

function createButton(buttonText, clickHandler) {
    const button = createElement("button");
    addClass(button, "button");
    text(button, buttonText);
    on(button, "click", clickHandler);

    return button;
}

function createGridDialog() {
    const content = createElement("div");

    let dialog = null;

    const okButton = createButton("确 定", e => dialog.done());
    const noButton = createButton("取 消", e => dialog.hide());

    dialog = new ui.xmap.MapDialog({
        parent: ui.page.mapContainer,
        title: "表格对话框",
        width: 480,
        height: 360,
        buttons: [okButton, noButton]
    }, content);
    dialog.initGridView(content, {
        columns: [
            { text: "", align: "center", len: 40, formatter: ui.ColumnStyle.cfn.rowNumber },
            { text: "名称", column: "name", align: "left", len: 100 },
            { text: "地址", column: "address", align: "left", len: 240 },
            { text: "类型", column: "category", align: "center", len: 60 },
            { formatter: ui.ColumnStyle.empty }
        ],
        pager: {
            pageIndex: 1,
            pageSize: 30
        },
        viewData: [
            { name: "南京新百", address: "南京市白下区南京中心1号", category: "购物" },
            { name: "总统府", address: "南京市白下区南京图书馆旁边", category: "景点" },
            { name: "南京大排档", address: "南京市湖南路狮子桥", category: "美食" },
            { name: "德基广场", address: "南京新街口", category: "购物" },
            { name: "中山陵", address: "南京紫金山", category: "景点" },
            { name: "玄武湖", address: "南京玄武区玄武门内", category: "景点" },
            { name: "牛首山", address: "南京江宁区牛首山景区", category: "景点" }
        ]
    });
    dialog.hiding(e => removeClass(document.getElementById("tableBox"), ui.page.mapButtonActive));

    return dialog;
}

function createPictureDialog() {
    const imagePreview = createElement("div");
    addClass(imagePreview, "image-preview");
    const viewPanel = createElement("div");
    addClass(viewPanel, "image-view-panel");
    const chooser = createElement("div");
    addClass(chooser, "image-preview-chooser");
    append(imagePreview, viewPanel, chooser);

    let dialog = null;

    const okButton = createButton("确 定", e => dialog.done());
    const noButton = createButton("取 消", e => dialog.hide());

    dialog = new ui.xmap.MapDialog({
        parent: ui.page.mapContainer,
        title: "图片对话框",
        width: 480,
        height: 412,
        buttons: [okButton, noButton]
    }, imagePreview);
    dialog.showing(e => {
        dialog.initImageView(imagePreview, {
            chooserSize: 48,
            images: [
                "/content/image/picture/1.jpg",
                "/content/image/picture/5.jpg",
                "/content/image/picture/12.jpg",
                "/content/image/picture/20.jpg",
                "/content/image/picture/27.jpg"
            ]
        });
    });
    dialog.hiding(e => removeClass(document.getElementById("pictureBox"), ui.page.mapButtonActive));

    return dialog;
}

//#endregion

//#region 数据加载

function loadMenuData() {
    ui.page.menu.setMenuList([
        {
            resourceCode: "1",
            resourceName: "HOME",
            icon: "/content/icon/sys-setting.png",
            url: "/home.html",
            children: null
        }
    ]);
}

//#endregion