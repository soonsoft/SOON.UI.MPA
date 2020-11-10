import ui from "soonui";

function dateChooser(element, option) {
    if(!element) {
        throw new TypeError("the parameter element is required.");
    }

    return ui.$(element).dateChooser(option);

}

export {
    dateChooser
};