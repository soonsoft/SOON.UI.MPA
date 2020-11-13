import "./screen.css";

import ui from "soonui";
import { pageSettings, pageInit, bodyAppend } from "../../../common/layout/screen-layout";
import "../../../common/x-map/x-map";
import { createLayout } from "../../../common/screen/screen";

pageSettings({
    title: "SCREEN",
    header: "SOON.UI SCREEN"
});

pageInit({
    created() {
        // 创建地图控制面板
        this.layerManager = createLayerManager(this.map);
    },
    layout() {
    }
});

function createLayerManager() {

}