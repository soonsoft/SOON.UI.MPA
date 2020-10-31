import ui from "soonui";

const masterInitConfig = {
    master: function() {
        this.loaded(function() {
            this.body.css({
                "visibility": "visible",
                "opacity": 0
            });
            ui.animator.fadeIn(this.body, 500);
        });

        initHead();
    },
    userPanel: function() {
        return {
            changeHighlightUrl: function(highlight) {
                $("#highlight").prop("href", ui.str.format("../../../dist/theme/color/ui.metro.{0}.css", highlight.Id));
                ui.theme.setHighlight(highlight);
            }
        };
    }
};

function initHead() {
    
}

function pageInit(pageInitConfig) {
    const config = ui.extend({}, masterInitConfig, pageInitConfig);
    ui.page.init(config);
}

export {
    pageInit
};