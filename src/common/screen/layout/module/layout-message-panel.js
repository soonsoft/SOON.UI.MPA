import ui from "soonui";
import { defineScreenModule } from "../../util/define";
import LayoutBaseModule from "./layout-base-module";

defineScreenModule("LayoutMessagePanel", LayoutBaseModule, {
    _init: function(option) {
        var events = ["messageclick"];
        this._super(option, events);
    },
    _createContent: function() {
        var content = $("<div style='width:100%;height:100%;' />");
        return content;
    },
    _initPanel: function(panel) {
        var maxLength = this.option.maxLength || 20;
        this.panel.messageList = new ui.ctrls.screen.MessageList({
            maxLength: maxLength,
            viewData: this.option.viewData,
            itemKey: this.option.itemKey
        }, this.panelContent);
        this.panel.messageList.messageclick((function(e, eventData) {
            this.fire("messageclick", eventData);
        }).bind(this));
    },
    setViewData: function(viewData) {
        if(this.panel.messageList) {
            this.panel.messageList.add(viewData);
        }
    }
});