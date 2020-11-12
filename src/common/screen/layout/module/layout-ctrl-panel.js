import ui from "soonui";
import { defineScreenModule } from "../../util/define";
import LayoutBaseModule from "./layout-base-module";

defineScreenModule("LayoutCtrlPanel", LayoutBaseModule, {
    _createContent() {
        var content = $("<div style='width:100%;height:100%;' />"),
            htmlBuilder = [],
            group,
            buttons = this.option.buttons;
        if(!buttons) {
            buttons = this.option.buttons = {};
        }

        htmlBuilder.push("<dl class='layer-list'>");
        Object.keys(buttons).forEach(function(key) {
            var button = buttons[key];
            if(group !== button.group) {
                if(!group) {
                    htmlBuilder.push("</dd>");
                }
                group = button.group;
                htmlBuilder.push("<dt class='layer-group-title'><span class='layer-group-text'>", group, "</span></dt>");
                htmlBuilder.push("<dd class='layer-group'>");
            }
            htmlBuilder.push("<a id='", key, "' class='layer-button'>");
            htmlBuilder.push("<span class='map-element'><i class='fa fa-star' /></span>");
            htmlBuilder.push("<span class='layer-button-text'>", button.text, "</span>");
            htmlBuilder.push("</a>");
        });
        htmlBuilder.push("</dd>");
        htmlBuilder.push("</dl>");

        content.html(htmlBuilder.join(""));

        return content;
    },
    _initPanel(panel) {
        var buttons = this.option.buttons;
        ui.setTask(function() {
            Object.keys(buttons).forEach(function(key) {
                var elem = $("#" + key),
                    button = buttons[key];
                elem.click(function(e) {
                    if(elem.hasClass("layer-button-selection")) {
                        elem.removeClass("layer-button-selection");
                        button.click(false);
                    } else {
                        elem.addClass("layer-button-selection");
                        button.click(true);
                    }
                });
            });
        });
    }
});