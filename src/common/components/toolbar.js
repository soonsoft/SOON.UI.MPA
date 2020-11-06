
function createToolbarBuilder() {
    const toolbarElement = document.createElement("div");
    toolbarElement.classList.add("toolbar", "clear");
    
    return {
        element: toolbarElement,
        addTools
    };
}

function addTools(tools) {
    if(!Array.isArray(tools) || tools.length === 0) {
        return;
    }
}

export {
    createToolbarBuilder
};
