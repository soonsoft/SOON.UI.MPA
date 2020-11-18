import ui from "soonui";
import { createElement, css, text, append, addClass, remove, prop, on, hasClass, removeClass, html } from "../html/html-utils";
import { initTitle, masterLoaded } from "./common";

ui.theme.currentTheme = "Galaxy";
ui.theme.backgroundColor = "#1A2637";
ui.theme.setHighlight({
    Name: "Galaxy",
    Color: "#00CCCC"
});

let pageSettingsOption = {
    title: "TITLE",
    header: "HEADER",
    showHomeButton: false
};

const masterInitConfig = {
    master() {
        this.mapButtonActive = "map-button-active";

        // 注册loaded事件
        this.loaded(() => {
            masterLoaded();
        });

        // 添加主题Tag颜色 
        ui.ctrls.Tag.addColor("theme", ui.theme.currentHighlight.Color);
    },
    userPanel() {
        return {
            name: "Admin",
            department: "总裁办",
            position: "CEO",
            operateList: [
                { text: "修改密码", url: "javascript:void(0)" }, 
                { text: "退出", url: "javascript:void(0)" }
            ]
        };
    }
};

//#region prepare page

function initHead() {
    let head = document.getElementById("head");
    if(!head) {
        return;
    }

    let header = head.getElementsByClassName("head-system-title");
    if(header.length === 0) {
        header = createElement("h1");
        addClass(header, "head-system-title", "title-color");
        append(header);
    } else {
        header = header[0];
    }

    if(pageSettingsOption.showHomeButton) {
        let homeButton = createElement("a");
        addClass(homeButton, "ui-home-button");
        prop(homeButton, "javascript:void(0)");
        append(header, homeButton);
    }

    let headerSpan = head.getElementsByClassName("head-system-title-text");
    let headerText = pageSettingsOption.header;
    if(headerSpan.length === 0) {
        headerSpan = createElement("span");
        addClass(headerSpan, "head-system-title-text");
        text(headerSpan, headerText);
        append(header, headerSpan);
    } else {
        text(headerSpan[0], headerText);
    }
}

function initMapContainer() {
    let contentBody = document.getElementById("body");
    contentBody = contentBody.getElementsByClassName("content-container");
    if(contentBody.length === 0) {
        throw new Error("not found .content-container element.");
    }

    ui.page.mapContainer = contentBody[0];
    addClass(ui.page.mapContainer, "map-contains");

    initMapDiv();
    initMapTools();
}

function initMapDiv() {
    const mapDiv = createElement("div");
    prop(mapDiv, {
        id: "map"
    });
    css(mapDiv, {
        width: "100%",
        height: "100%"
    });

    bodyAppend(mapDiv);
}

function initMapTools() {
    const mapToolbar = createElement("div");
    addClass(mapToolbar, "toolbar", "clear");

    bodyAppend(mapToolbar);
}

//#endregion

function pageSettings(settings) {
    pageSettingsOption = ui.extend({}, pageSettingsOption, settings);
}

function pageInit(pageInitConfig) {
    initTitle(pageSettingsOption.title);
    initHead();
    initMapContainer();

    const config = ui.extend({}, masterInitConfig, pageInitConfig);
    ui.page.init(config);
}

function bodyAppend(element) {
    if(!element) {
        return;
    }
    append(ui.page.mapContainer, element);
}

export {
    pageSettings,
    pageInit,
    bodyAppend
};