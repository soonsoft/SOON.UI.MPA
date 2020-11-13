import { text, append } from "../html/html-utils";

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

export {
    initTitle
};