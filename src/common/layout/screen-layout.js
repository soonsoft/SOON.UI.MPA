import ui from "soonui";
import { createElement, css, text, append, addClass, remove } from "../html/html-utils";
import { initTitle } from "./common";

ui.theme.currentTheme = "Galaxy";
ui.theme.backgroundColor = "#1A2637";
ui.theme.setHighlight({
    Name: "Galaxy",
    Color: "#00CCCC"
});

const headerHeight = 64;
const $ = ui.$;

ui.page.get("master").setHandler(function(arg) {
    this.head = $("#head");
    this.body = $("#body");
    
    if(this.head.length > 0) {
        css(this.head, {
            height: headerHeight + "px"
        });
        initHeader(this.head[0], pageSettingsOption.headerWidth, pageSettingsOption.header);
    }
    if(this.body.length > 0) {
        css(this.body, {
            top: headerHeight + "px",
            position: "absolute"
        })
    }

    // 修正布局高度，内容区域满屏
    const layoutSize = () => {
        this.contentBodyHeight = document.documentElement.clientHeight - headerHeight;
        this.contentBodyWidth = document.documentElement.clientWidth;
        css(this.body, {
            height: this.contentBodyHeight + "px"
        });
    };
    layoutSize();
    this.resize(layoutSize, ui.eventPriority.bodyResize);

    if(ui.core.isFunction(arg)) {
        arg.call(this);
    }
});

let pageSettingsOption = {
    title: "TITLE",
    header: "HEADER",
    headerWidth: 360,
    leftIconButtons: [],
    rightIconButtons: []
};

const masterInitConfig = {
    master() {
        this.mapButtonActive = "map-button-active";
        this.panelMarginValue = 10;
        this.headerHeight = headerHeight;

        // 注册loaded事件
        this.loaded(() => {
            let pageProgress = document.getElementsByClassName("page-progress");
            if(pageProgress.length > 0) {
                pageProgress = pageProgress[0];
                remove(pageProgress);
            }

            css(this.body, {
                visibility: "visible",
                opacity: 0
            });
            ui.animator.fadeIn(this.body, 500);

            ui.ajax.global.start(function() {
                ui.loadingShow();
            });
            ui.ajax.global.complete(function() {
                ui.loadingHide();
            });
        });

        // 添加主题Tag颜色 
        ui.ctrls.Tag.addColor("theme", ui.theme.currentHighlight.Color);

        // 注册时间
        let timeElem = document.getElementById("timeTool");
        setInterval(function() {
            text(timeElem, ui.date.format(new Date(), "yyyy-MM-dd EEEE, HH:mm"));
        }, 1000);
    }
};

//#region 布局初始化

function initHeader(head, headerWidth, headerTitle) {
    let screenHeader = head.getElementsByClassName("screen-header");
    if(!screenHeader || screenHeader.length === 0) {
        return;
    }
    screenHeader = screenHeader[0];
    css(screenHeader, {
        width: headerWidth + "px"
    });

    let screenBackground = screenHeader.getElementsByClassName("screen-background");
    if(screenBackground.length > 0) {
        screenBackground = screenBackground[0];
        css(screenBackground, {
            transform: "perspective(" + Math.floor(headerWidth * 0.142) + "px) rotateX(-14deg)"
        });
    }

    let screenTitle = screenHeader.getElementsByClassName("screen-title");
    if(screenTitle.length > 0) {
        screenTitle = screenTitle[0];
        text(screenTitle, headerTitle);
    }
}

//#endregion

function pageSettings(settings) {
    pageSettingsOption = ui.extend({}, pageSettingsOption, settings);
}

function pageInit(pageInitConfig) {
    initTitle(pageSettingsOption.title);

    const config = ui.extend({}, masterInitConfig, pageInitConfig);
    ui.page.init(config);
}

function bodyAppend(element) {
    if(!element || !ui.page.body) {
        return;
    }

    append(ui.page.body, element);
}

export {
    pageSettings,
    pageInit,
    bodyAppend
};
