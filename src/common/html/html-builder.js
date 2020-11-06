
import ui from "soonui";

function createElemnet() {

}

class Element {
    constructor(nodeName) {
        this.element = document.createElement(nodeName);
    }

    prop() {
        const elem = ui.$(this.element);
        elem.prop.apply(elem, arguments);
        return this;
    }

    attr() {
        const elem = ui.$(this.element);
        elem.attr.apply(elem, arguments);
        return this;
    }

    css() {
        const elem = ui.$(this.element);
        elem.css.apply(elem, arguments);
        return this;
    }
}