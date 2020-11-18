import ui from "soonui";
import "../../../common/x-map/x-map";
import { createLayout } from "../../../common/screen/screen";
import { pageSettings, pageInit, bodyAppend } from "../../../common/layout/map-layout";

pageSettings({
    title: "X-MAP",
    header: "SOON.UI X-MAP",
    showHomeButton: true
});

pageInit({
    menu: true,
    created() {
        this.panelManager = createPanelManager();
    },
    layout() {
        const width = this.contentBodyWidth;
        const height = this.contentBodyHeight;

        this.panelManager.arrange(width, height, this.panelManagerResizeFlag);
        this.panelManagerResizeFlag = true;
    },
    load() {
        loadMenuData();
        this.panelManager.show();
    }
});

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
        flexibleHeight: 1,
        width: 240,
        height: 180,
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