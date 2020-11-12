import ui from "soonui";
import { defineXMapComponent } from "../util/define";

const showedToolPanelArray = [];
const body = document.body;

export default defineXMapComponent("MapToolPanel", {
    _defineOption() {
        return {
            top: 48,
            width: 240,
            height: 360,
            // 是否互斥
            isExclusive: true,
            // 是否失去焦点自动关闭
            isFocusOutHide: true,
            container: null
        };
    },
    _defineEvents() {
        return ["showing", "shown", "hiding", "hidden"];
    },
    _create() {
        var that = this;
        this.container = this.option.container || body;
        if(!ui.core.isJQueryObject(this.container)) {
            this.container = $(this.container);
        }
        this.toolPanelClassName = "map-tool-panel";
        this.toolPanel = $("<div class='map-background' />");
        this.toolPanel.addClass(this.toolPanelClassName);
        this.toolPanel.click(function(e) {
           e.stopPropagation();
        });
        this._isShow = false;

        this.onShown = function() {
            that.fire("shown");
        };
        this.onHidden = function() {
            that.fire("hidden");
        };

        this.animator = ui.animator({
            target: this.toolPanel,
            ease: ui.AnimationStyle.easeTo,
            onChange: function(val) {
                this.target.css("top", val + "px");
            }
        }).add({
            target: this.toolPanel,
            ease: ui.AnimationStyle.easeTo,
            onChange: function(val) {
                this.target.css("opacity", val / 100);
            }
        });
        this.animator.duration = 300;

        if(this.option.isFocusOutHide) {
            // 注册全局点击事件
            ui.page.htmlclick(function () {
                if(that.isShow()) {
                    that.hide();
                }
            });
        }
    },
    _render() {
        this.toolPanel.css({
            "width": (ui.core.isNumeric(this.option.width)
                        ? this.option.width + "px"
                        : this.option.width),
            "height": (ui.core.isNumeric(this.option.height)
                        ? this.option.height + "px"
                        : this.option.height),
            "top": 0
        });
        if(this.option.left) {
            this.toolPanel.css("left", this.option.left + "px");
        }
        if(this.option.right) {
            this.toolPanel.css("right", this.option.right + "px");
        }

        this.container.append(this.toolPanel);
    },
    _preShow(targetPosition) {
        var targetLeft = targetPosition.left,
            left,
            top,
            containerOffset,
            clientWidth,
            clientHeight;
        
        if(!ui.core.isNumeric(targetLeft)) {
            return;
        }

        clientWidth = document.documentElement.clientWidth;
        clientHeight = document.documentElement.clientHeight;

        containerOffset = this.container.offset();
        containerOffset.width = this.container.width();
        containerOffset.height = this.container.height();

        if((containerOffset.left + containerOffset.width) < clientWidth) {
            clientWidth = containerOffset.left + containerOffset.width;
        }

        if((containerOffset.top + containerOffset.height) < clientHeight) {
            clientHeight = containerOffset.top + containerOffset.height;
        }

        this.width = this.option.width;
        left = targetLeft || 0;

        if(left + this.width > clientWidth) {
            left = left - ((left + this.width) - clientWidth);
        }

        this.toolPanel.css({
            "left": left + "px",
            "right": "auto"
        });
    },
    show(animation, targetPosition) {
        var option,
            toolPanel;

        if(ui.core.isPlainObject(animation)) {
            targetPosition = animation;
            animation = true;
        }
        if(targetPosition) {
            this._preShow(targetPosition);
        }
        if(this.isShow()) {
            return;
        }

        while(showedToolPanelArray.length) {
            toolPanel = showedToolPanelArray.shift();
            if(toolPanel) {
                toolPanel.hide();
            }
        }
        if(this.fire("showing") === false) {
            return;
        }

        if(animation === false) {
            this.element.css({
                "display": "block",
                "top": this.option.top + "px",
                "opacity": 1
            });
            return;
        }

        this.animator.stop();

        option = this.animator[0];
        option.ease = ui.AnimationStyle.easeTo;
        option.begin = parseFloat(option.target.css("top")) || 0;
        option.end = this.option.top;

        option = this.animator[1];
        option.ease = ui.AnimationStyle.easeTo;
        option.begin = parseFloat(option.target.css("opacity")) || 0;
        option.end = 100;

        option.target.css("display", "block");
        this._isShow = true;
        if(this.option.isExclusive) {
            showedToolPanelArray.push(this);
        }

        this.animator.onEnd = this.onShown;
        this.animator.start();
    },
    hide(animation) {
        var option;

        if(!this.isShow()) {
            return;
        }

        if(this.fire("hiding") === false) {
            return;
        }

        if(animation === false) {
            this.element.css({
                "display": "none",
                "top": 0,
                "opacity": 0
            });
            return;
        }

        this.animator.stop();

        option = this.animator[0];
        option.ease = ui.AnimationStyle.easeTo;
        option.begin = parseFloat(option.target.css("top")) || this.option.top;
        option.end = 0;

        option = this.animator[1];
        option.ease = ui.AnimationStyle.easeTo;
        option.begin = (parseFloat(option.target.css("opacity")) * 100) || 100;
        option.end = 0;

        this.animator.onEnd = this.onHidden;
        this._isShow = false;
        this.animator.start().then(function() {
            option.target.css("display", "none");
        });
    },
    isShow() {
        return this._isShow;
    }
});