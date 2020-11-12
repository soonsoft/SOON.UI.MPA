import { defineXMapComponent } from "../util/define";
import MapToolPanel from "./map-tool-panel";

defineXMapComponent("MapTrack", MapToolPanel, {
    _defineOption() {
        return {
            // CloudAtlas对象
            map: null,
            width: 160,
            height: 48,
            right: 173,
            // 是否互斥
            isExclusive: false,
            // 是否失去焦点自动关闭
            isFocusOutHide: false,
        };
    },
    _render() {
        var content,
            that;

        content = $("<div class='map-track-ctrl' />");
        this.playButton = $("<a href='javascript:void(0)' class='map-track-button' style='margin-left:8px;'></a>");
        this.speedAddButton = $("<a href='javascript:void(0)' class='map-track-button2'><i class='fa fa-plus-square'></i></a>");
        this.speedValue = $("<span class='map-track-button2' style='opacity:1;width:36px'></span>");
        this.speedMinusButton = $("<a href='javascript:void(0)' class='map-track-button2'><i class='fa fa-minus-square'></i></a>");
        content.append(this.playButton);
        content.append(this.speedMinusButton);
        content.append(this.speedValue);
        content.append(this.speedAddButton);

        this._super();
        this.toolPanel.append(content);

        that = this;
        this._updatePlayStatus("stop");
        this._updateSpeedStatus(1);
        this.playButton.click(function(e) {
            if(that.playStatus === "stop") {
                that._updatePlayStatus("play");
            } else {
                that._updatePlayStatus("stop");
            }
        });
        this.speedAddButton.click(function(e) {
            if(that.speedStatus >= 4) {
                return;
            }
            that._updateSpeedStatus(that.speedStatus * 2);
        });
        this.speedMinusButton.click(function(e) {
            if(that.speedStatus <= 0.25) {
                return;
            }
            that._updateSpeedStatus(that.speedStatus / 2);
        });
    },
    _updatePlayStatus(status) {
        this.playStatus = status;
        if(this.playStatus === "stop") {
            this.playButton.html("<i class='fa fa-play' title='播放'></i>");
            this.option.map.stopPathAnimation();
        } else if(this.playStatus === "play") {
            this.playButton.html("<i class='fa fa-stop' title='停止'></i>");
            this._updateSpeedStatus(this.speedStatus);
            var that = this;
            this.option.map.startPathAnimation(function () {
                that.playStatus = "stop";
                that.playButton.html("<i class='fa fa-play' title='播放'></i>");
            });
        }
    },
    _updateSpeedStatus(status) {
        this.speedStatus = status;
        this.speedValue.text(this.speedStatus + "x");
        this.option.map.setPathAnimationSpeed(this.speedStatus);
    },
    setTrackData(data) {
        this.option.map.setPathLayerData(data);
    },
    show() {
        this._updatePlayStatus("stop");
        this._super.apply(this, arguments);
    }
});