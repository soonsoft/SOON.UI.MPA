import ui from "soonui";
import { text, append, remove, css } from "../html/html-utils";

function initTitle(titleText) {
    let title = document.getElementsByTagName("title");
    if(title.length === 0) {
        title = createElement("title");
        text(title, titleText);
        let head = document.getElementsByTagName("head")[0];
        append(head, title);
    } else {
        text(title[0], titleText);
    }
}

function masterLoaded() {
    let pageProgress = document.getElementsByClassName("page-progress");
    if(pageProgress.length > 0) {
        pageProgress = pageProgress[0];
        remove(pageProgress);
    }

    css(ui.page.body, {
        visibility: "visible",
        opacity: 0
    });
    ui.animator.fadeIn(ui.page.body, 500);

    ui.ajax.global.start(function() {
        ui.loadingShow();
    });
    ui.ajax.global.complete(function() {
        ui.loadingHide();
    });
}

export {
    initTitle,
    masterLoaded
};