import ui from "soonui";
import { defineXMapComponent } from "../util/define";

ui.ctrls.DialogBox.setShowStyle("rightShow", function () {
    var clientWidth,
        option,
        that;

    that = this;
    clientWidth = this.parent.width();

    option = this.animator[0];
    option.begin = clientWidth;
    option.end = clientWidth - this.offsetWidth - 20;
    option.onChange = function (left) {
        that.box.css("left", left + "px");
    };
    this.openMask();
    this.animator.onEnd = function () {
        that.onShown();
    };

    this.box.css({
        "top": this.option.top + "px",
        "left": option.begin + "px",
        "display": "block"
    });
});

ui.ctrls.DialogBox.setShowStyle("leftShow", function () {
    var option,
        that;

    that = this;

    option = this.animator[0];
    option.begin = -this.offsetWidth;
    option.end = 20;
    option.onChange = function (left) {
        that.box.css("left", left + "px");
    };
    this.openMask();
    this.animator.onEnd = function () {
        that.onShown();
    };

    this.box.css({
        "top": this.option.top + "px",
        "left": option.begin + "px",
        "display": "block"
    });
});

defineXMapComponent("MapDialog", ui.ctrls.DialogBox, {
    _defineOption() {
        return {
            show: "rightShow",
            done: "right",
            hide: "right",
            top: 48,
            width: 480,
            height: 360,
            maskable: false,
            suitable: false,
            resizeable: false,
            autoPosition: true,
            titleHeight: 30,
            tabs: null,
            style: {
                "border": "solid 1px",
                "border-radius": "16px 0 16px 0",
                "overflow": "hidden"
            },
            boxCtrls: [
                {
                    type: "closable", 
                    className: "style-dialog-button", 
                    css: null
                }
            ]
        };
    },
    _defineEvents() {
        var events = this._super();
        events.push("moveStart", "moveEnd");
        return events;
    },
    _render() {
        var title,
            tabFn;

        title = this.option.title;
        this.option.title = {
            text: $("<span class='font-highlight'>" + title + "</span>"),
            hasHr: false,
            style: {
                "line-height": "30px",
                "background-color": "rgba(255,255,255,.1)",
                "overflow": "hidden"
            }
        };
        // 生成tab
        if(this.option.tabs) {
            tabFn = this._initTabs(this.option.tabs);
        }

        if(!this.option.showCloseButton) {
            this._initClosableButton = noop;
        }
        this._super();

        if(ui.core.isFunction(tabFn)) {
            this.tab = tabFn.call(this);
        }

        this.parent = this.option.parent || body;
        if(this.option.parent) {
            this.parent.append(this.box);
        }

        this.isMaximize = false;

        // 自适应
        if(this.option.autoPosition) {
            ui.page.resize((function()  {
                if(this.isShow()) {
                    if(this.isMaximize) {
                        this._maximize(true);
                    } else {
                        this.box.css({
                            "top": this.option.top + "px",
                            "left": (this.option.show === "rightShow" ? this.parent.width() - this.offsetWidth - 20 : 20) + "px"
                        });
                    }
                }
            }).bind(this), ui.eventPriority.elementResize);
        }
    },
    _initContent() {
        if(Array.isArray(this.option.tabs)) {
            return;
        }
        this._super();
    },
    _initDraggable() {
        var option = {
            target: this.box,
            parent: this.parent || body,
            hasIframe: this.hasIframe(),
            onBeginDrag: (function() {
                this.fire("moveStart");
            }).bind(this),
            onEndDrag: (function() {
                this.fire("moveEnd");
            }).bind(this)
        };
        this.titlePanel
            .addClass("draggable-handle")
            .draggable(option);
    },
    _initMaximizeButton() {
        var that = this;

        this.maximizeBtn = $("<a href='javascript:void(0)' style='font-size:12px;'><i class='fa fa-window-maximize'></i></a>");
        this.maximizeBtn.attr("class", this.option.closeButtonStyle || "closable-button");
        if(this.option.showCloseButton) {
            this.maximizeBtn.css("right", "30px");
        }

        this.maximizeBtn.click(function() {
            that._maximize(!that.isMaximize);
        });
        this.box.append(this.maximizeBtn);
        if(this.tab) {
            this.resize(function(e) {
                this.tab.putBodies(this.contentWidth, this.contentHeight);
                this.tab.restore();
            });
        }
    },
    _maximize(state) {
        var parentWidth = this.parent.width(),
            parentHeight = this.parent.height();
        if(state === this.isMaximize) {
            return;
        }
        if(state) {
            this.isMaximize = true;
            this.maximizeBtn.html("<i class='fa fa-window-restore'></i>");
            this.box.css({
                "top": 0,
                "left": 0
            });
            this._setSize(parentWidth, parentHeight);
        } else {
            this.isMaximize = false;
            this.maximizeBtn.html("<i class='fa fa-window-maximize'></i>");
            this.box.css({
                "top": this.option.top + "px",
                "left": (this.option.show === "rightShow" ? parentWidth - this.offsetWidth - 20 : 20) + "px"
            });
            this._setSize(this.option.width, this.option.height);
        }
    },
    _initTabs(tabs) {
        var i, len,
            tab,
            tabBodies,
            title;
        if(!Array.isArray(tabs)) {
            return;
        }

        title = this.option.title;
        title.style["background-color"];
        title.text = [];
        tabBodies = [];
        for(i = 0, len = tabs.length; i < len; i++) {
            tab = tabs[i];
            title.text.push("<a class='dialog-tab-button' data-tab-index='", i, "'>");
            title.text.push("<span>", tab.title, "</span>");
            title.text.push("<i class='dialog-tab-button-pointer'></i>");
            title.text.push("</a>");
            if(!ui.core.isJQueryObject(tab.body)) {
                if(ui.core.isString(tab.body)) {
                    tab.body = $(tab.body);
                } else {
                    tab.body = $("<div />");
                }
            }
            tab.body.addClass("ui-tab-body");
            tabBodies.push(tab.body);
        }
        title.text = $(title.text.join(""));

        return function() {
            var currentClass = "current-dialog-tab",
                tab;
            this.contentPanel
                    .append(tabBodies)
                    .css("overflow", "hidden");
            this.titlePanel.click(function(e) {
                var elem = $(e.target),
                    index;
                while (!elem.hasClass("dialog-tab-button")) {
                    elem = elem.parent();
                    if(elem.hasClass("ui-dialog-box-title")) {
                        return;
                    }
                }

                index = parseInt(elem.attr("data-tab-index"), 10);
                if(index !== tab.getCurrentIndex()) {
                    tab.showIndex(index);
                }
            });

            this.contentPanel.addClass("white-panel");
            tab = new ui.ctrls.TabView({
                type: "view",
                bodyPanel: this.contentPanel,
                duration: 500
            });
            tab.changing(function(e, index) {
                var i, len,
                    button;
                for(i = 0, len = title.text.length; i < len; i++) {
                    button = $(title.text[i]);
                    if(button.hasClass(currentClass)) {
                        button.removeClass(currentClass);
                        break;
                    }
                }
                button = $(title.text[index]);
                button.addClass(currentClass);
            });

            tab.putBodies(this.contentWidth, this.contentHeight);
            tab.restore();

            tab.getBody = function(index) {
                var len = this.bodies.length;
                if(index < 0 || index >= len) {
                    return null;
                }

                return $(this.bodies[index]);
            };

            return tab;
        };
    },
    initTemplateView(container, option) {
        if(!container) {
            throw new TypeError("在地图对话框中初始化模板视图时必须要传递容器。");
        }
        if(!option) {
            option = {};
        }

        if(ui.core.isString(option.template) && option.template.length > 0) {
            option.builder = ui.parseTemplate(option.template);
        }

        if(!ui.core.isPlainObject(option.formatter)) {
            option.formatter = {};
        }

        option.bindData = function(data) {
            if(!this.builder || !data) {
                this.clear();
                return;
            }
            container.html(this.builder.bind(data, this.formatter));
        };
        option.clear = function() {
            container.empty();
        };
        this.templateView = option;

        return this.templateView;
    },
    initGridView(container, option) {
        container = ui.getJQueryElement(container);
        if(!container) {
            throw new TypeError("在地图对话框中初始化表格时必须要传递容器。");
        }
        if(!option) {
            option = {
                pager: {
                    pageIndex: 1,
                    pageSize: 30
                },
                selection: false
            };
        }
        option.textFormatter = ui.ColumnStyle.cfn.paragraph;
        option.width = this.contentWidth;
        option.height = this.contentHeight;
        this.contentPanel.css("overflow", "hidden");
        this.gridView = new ui.ctrls.GridView(option, container);

        return this.gridView;
    },
    initImageView(container, option) {
        container = ui.getJQueryElement(container);
        if(!container) {
            throw new TypeError("在地图对话框中初始化图片视图时必须要传递容器。");
        }
        if(!option) {
            option = {};
        }
        option.imageMargin = 4;
        option.interval = false;
        this.imageView = container.imagePreview(option);
        this.imageView.ready(function(e, images) {
            var zoomer = new ui.ctrls.ImageZoomer();
            this.imageViewer.images.forEach(function(image) {
                var img = image.view.children("img");
                img.addImageZoomer(zoomer);
            });
        });

        return this.imageView;
    },
    initChartView(container, option) {
        var globel = ui.core.global();
        container = ui.getJQueryElement(container);
        if(!container) {
            throw new TypeError("在地图对话框中初始化图表视图时必须要传递容器。");
        }
        if(!globel.echarts) {
            throw new TypeError("请先引入echarts.simple.min.js");
        }

        if(!option) {
            option = {};
        }

        option.width = option.width || this.contentWidth;
        option.height = option.height || this.contentHeight;

        container.css({
            "width": option.width + "px",
            "height": option.height + "px",
            "overflow": "hidden"
        });
        this.chartView = globel.echarts.init(container.get(0));

        return this.chartView;
    },
    initVideoView(container, option) {
        var provider;
        container = ui.getJQueryElement(container);
        if(!container) {
            throw new TypeError("在地图对话框中初始化视频视图时必须要传递容器。");
        }

        if(this.operatePanel) {
            container.css("bottom", 0);
        }

        if(!option) {
            option = {};
        }

        provider = option.provider || "HikVision";
        provider = CloudAtlas.media[provider];
        if(!ui.core.isFunction(provider)) {
            provider = CloudAtlas.media.HikVision;
        }

        this.videoView = new provider(option, container);

        return this.videoView;
    }
});