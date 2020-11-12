import { defineXMapComponent } from "../util/define";
import MapToolPanel from "./map-tool-panel";

defineXMapComponent("MapLightAdjust", MapToolPanel, {
    _defineOption() {
        return {
            // 子元素格式化器
            layerFormatter: null,
            // 初始值
            value: 100,
            // xmap对象
            map: null,
            // 标题文字
            title: "底图亮度",
            width: 240,
            height: 48,
            right: 20
        };
    },
    _defineEvents() {
        return ["changed"];
    },
    _render() {
        var content,
            adjust,
            valueText,
            that;

        content = $("<div class='map-light-ctrl' />");
        content.append("<i class='map-light-icon fa fa-adjust' title='" + this.option.title + "'></i>");
        adjust = $("<div class='map-light-adjust' />");
        content.append(adjust);
        valueText = $("<div class='map-light-value'>0%</div>");
        content.append(valueText);

        this._super();
        this.toolPanel.append(content);

        that = this;
        this.adjuster = adjust.slidebar();
        this.adjuster.changed(function(e, percent) {
            valueText.html(percent + "%");
            if(that.option.map) {
                that.option.map.setOpacity(percent / 100);
            }
            that.fire("changed", percent);
        });
        this._isFirstShow = true;
    },
    show() {
        this._super.apply(this, arguments);
        if(this._isFirstShow) {
            this.adjuster.percentValue = this.option.value || 100;
            this._isFirstShow = false;
        }
    }
});