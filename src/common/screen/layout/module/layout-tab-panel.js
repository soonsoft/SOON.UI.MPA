import ui from "soonui";
import { defineScreenModule } from "../../util/define";
import LayoutBaseModule from "./layout-base-module";

defineScreenModule("LayoutTabPanel", LayoutBaseModule, {
    _init(option) {
        var events = ["tabchanged", "tabchanging"];
        this._super(option, events);
    },
    _createContent() {
        return null;
    },
    _initPanel() {
        this.panel.tab.changing((function(e, index) {
            var eventData = {
                lastIndex: this.panel.tab.getCurrentIndex(),
                index: index,
                target: this.panel.tab
            };
            return this.fire("tabchanging", eventData);
        }).bind(this));
        this.panel.tab.changed((function(e, index) {
            var eventData = {
                index: index,
                target: this.panel.tab
            };
            this.fire("tabchanged", eventData);
        }).bind(this));
        
        ui.setTask((function() {
            this.panel.tab.showIndex(0, false);
        }).bind(this));
    }
});