import style from "./login.css";

import ui from "soonui";
import { css } from "../../../common/html/html-utils";

const $ = ui.$;

class Parallax {
    constructor(view, image, width, height) {
        this.imageScale = 1.1;
        this.view = view;
        this.image = image;
        this.enabled = true;

        if(ui.core.type(width) === "number") {
            this.width = width;
        } else {
            this.width = this.view.width();
        }
        if(ui.core.type(height) === "number") {
            this.height = height;
        } else {
            this.height = this.view.height();
        }
        this.initial();
    }

    initial() {
        this.view.css({
            "position": "relative",
            "overflow": "hidden"
        });
        this.image.css("position", "absolute");
        this.initialImageAnimator();
        this.view.mouseenter(e => {
            if (this.enabled) {
                this.changeImageLocation(e.clientX, e.clientY, true);
            }
        });
        this.view.mousemove(e => {
            if (this.enabled) {
                this.changeImageLocation(e.clientX, e.clientY);
            }
        });
        this.view.mouseleave(e => {
            if (this.enabled) {
                this.stopImageLocation();
            }
        });
    }

    initialImageAnimator() {
        this.imageAnimator = ui.animator({
            target: this.image,
            ease: ui.AnimationStyle.easeFromTo,
            onChange: function(val) {
                this.target.css("top", val + "px");
            }
        }).add({
            target: this.image,
            ease: ui.AnimationStyle.easeFromTo,
            onChange: function(val) {
                this.target.css("left", val + "px");
            }
        });
        this.imageAnimator.onEnd = () => {
            this.beginAnimation = false;
        };
        this.imageAnimator.duration = 200;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.resetImageLocation();
    }

    resetImageLocation() {
        this.imageWidth = this.width * this.imageScale;
        this.imageHeight = this.height * this.imageScale;
        this.imageMoveWidth = this.imageWidth - this.width;
        this.imageMoveHeight = this.imageHeight - this.height;

        css(this.image, {
            width: this.imageWidth + "px",
            height: this.imageHeight + "px",
            top: -(this.imageMoveHeight / 2) + "px",
            left: -(this.imageMoveWidth / 2) + "px"
        });
    }

    changeImageLocation(x, y) {
        if(this.beginAnimation) {
            return;
        }
        const p = this.view.offset();
        x -= p.left + 1;
        y -= p.top + 1;

        const currentLeft = parseFloat(this.image.css("left"));
        const currentTop = parseFloat(this.image.css("top"));
        const left = -(this.imageMoveWidth * (x / this.width));
        const top = -(this.imageMoveHeight * (y / this.height));

        if(Math.abs(currentLeft - left) > 20 || Math.abs(currentTop - top) > 20) {
            let  option = this.imageAnimator[0];
            option.begin = currentTop;
            option.end = top;

            option = this.imageAnimator[1];
            option.begin = currentLeft;
            option.end = left;
            
            this.beginAnimation = true;
            this.imageAnimator.start();
        } else {
            css(this.image, {
                top: top + "px",
                left: left + "px"
            });
        }
    }

    stopImageLocation() {
        if(this.beginAnimation) {
            this.beginAnimation = false;
            this.imageAnimator.stop();
        }
    }

}

const loginWindow = {
    size: {
        small: {
            width: 958,
            height: 512,
            startWidth: 0,
            startHeight: 0,
            logoTop: 70,
            logoSize: "2.5em",
            formTop: 284
        },
        middle: {
            width: 1366,
            height: 768,
            startWidth: 1440,
            startHeight: 960,
            logoTop: 140,
            logoSize: "3.4em",
            formTop: 500
        },
        large: {
            width: 1920,
            height: 1080,
            startWidth: 2560,
            startHeight: 1440,
            logoTop: 200,
            logoSize: "4.2em",
            formTop: 712
        }
    },
    initial() {
        this.loginWindow = $("#loginWindow");
        this.loginPanel = this.loginWindow.children(".login-panel");
        this.bgImg = this.loginWindow.children(".bgImage");
        this.logo = this.loginPanel.find(".logo");
        this.loginContent = this.loginPanel.find(".form-content");

        this.parallax = new Parallax(this.loginWindow, this.bgImg);
        this.initFocus();

        this.onResize();
        this.loginWindow.css("visibility", "visible");
        ui.page.resize(() => {
            this.onResize();
        }, ui.eventPriority.bodyResize);

        //$("#username").focus();
    },
    initFocus() {
        this.onSpotlightHandle = null;
        this.offSpotlightHandle = null;
        this.spotlightAnimator = ui.animator({
            target: $(".panel-background"),
            ease: ui.AnimationStyle.easeTo,
            onChange: function (val) {
                this.target.css({
                    "filter": "Alpha(opacity=" + val + ")",
                    "opacity": val / 100
                });
            }
        });
        this.spotlightAnimator.duration = 500;

        const onFocus = e => {
            this.parallax.enabled = false;
            clearTimeout(this.offSpotlightHandle);
            this.offSpotlightHandle = null;
            if (this.spotlightAnimator.isStarted) {
                this.spotlightAnimator.stop();
            }
            this.onSpotlightHandle = setTimeout(function () {
                this.onSpotlightHandle = null;
                this.onSpotlight();
            }, 200);
        };
        const onBlur = e => {
            this.parallax.enabled = true;
            clearTimeout(this.onSpotlightHandle);
            this.onSpotlightHandle = null;
            if (this.spotlightAnimator.isStarted) {
                this.spotlightAnimator.stop();
            }
            this.offSpotlightHandle = setTimeout(function () {
                this.offSpotlightHandle = null;
                this.offSpotlight();
            }, 200);
        };

        $("#username").focus(onFocus).blur(onBlur);
        $("#password").focus(onFocus).blur(onBlur);
    },
    onResize() {
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;

        const size = this.getSize();
        const flag = size !== this.currentSize;
        this.currentSize = size;

        this.panelWidth = size.width;
        this.panelHeight = size.height;

        this.setLocation();
        if (flag) {
            this.setSize(size);
        }
    },
    getSize() {
        const sizeArray = ["small", "middle", "large"];
        const width = this.clientWidth;
        const height = this.clientHeight;

        for (let i = sizeArray.length - 1; i >= 0; i--) {
            let size = this.size[sizeArray[i]];
            if (width >= size.startWidth && height >= size.startHeight) {
                return size;
            }
        }
    },
    setLocation() {
        const left = (this.clientWidth - this.panelWidth) / 2;
        const top = (this.clientHeight - this.panelHeight) / 2;
        if (left < 0) {
            left = 0;
        }
        this.loginWindow.css({
            top: top + "px",
            left: left + "px"
        });
    },
    setSize(size) {
        this.loginWindow.css({
            width: this.panelWidth + "px",
            height: this.panelHeight + "px"
        });
        this.logo.css("font-size", size.logoSize);
        if (this.parallax) {
            this.parallax.resize(this.panelWidth, this.panelHeight);
        }
        this.elementAnimate(size.logoTop, size.formTop);
    },
    elementAnimate(logoTop, formTop) {
        if (!this.elemAnimator) {
            this.elemAnimator = ui.animator({
                target: this.logo,
                ease: ui.AnimationStyle.easeTo,
                onChange: function (val) {
                    this.target.css("top", val + "px");
                }
            }).add({
                target: this.logo,
                ease: ui.AnimationStyle.easeFrom,
                onChange: function (val) {
                    this.target.css({
                        "filter": "Alpha(opacity=" + val + ")",
                        "opacity": val / 100
                    });
                }
            }).add({
                target: this.loginContent,
                ease: ui.AnimationStyle.easeTo,
                onChange: function (val) {
                    this.target.css("top", val + "px");
                }
            }).add({
                target: this.loginContent,
                ease: ui.AnimationStyle.easeFrom,
                onChange: function (val) {
                    this.target.css({
                        "filter": "Alpha(opacity=" + val + ")",
                        "opacity": val / 100
                    });
                }
            });
            this.elemAnimator.duration = 500;
        }

        this.elemAnimator.stop();

        let option = this.elemAnimator[0];
        option.begin = parseFloat(option.target.css("top"), 10);
        option.end = logoTop;
        option = this.elemAnimator[1];
        option.begin = 0;
        option.end = 80;
        option = this.elemAnimator[2];
        option.begin = formTop + 200;
        option.end = formTop;
        option = this.elemAnimator[3];
        option.begin = 0;
        option.end = 100;

        this.elemAnimator.start();
    },
    onSpotlight() {
        const option = this.spotlightAnimator[0];
        option.begin = Math.floor(parseFloat(option.target.css("opacity")) * 100) || 0;
        option.end = 40;
        this.spotlightAnimator.start();
    },
    offSpotlight() {
        const option = this.spotlightAnimator[0];
        option.begin = Math.floor(parseFloat(option.target.css("opacity")) * 100) || 0;
        option.end = 0;
        this.spotlightAnimator.start();
    },
    showError() {
        let url = location.href;
        let index = url.indexOf("?");
        if(index > -1) {
            let queryString = url.substring(index + 1);
            if(queryString.indexOf("error") > -1) {
                ui.errorShow("用户名或密码错误。");
            }
        }
    }
};

ui.page.ready(() => {
    loginWindow.initial();
    loginWindow.showError();
});