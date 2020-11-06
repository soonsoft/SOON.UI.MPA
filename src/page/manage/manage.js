import style from "./manage.css";

import ui from "soonui";
import { pageInit, bodyAppend } from "../../common/layout/layout-master";
import { createToolbarBuilder } from "../../common/components/toolbar";

ui.page.title = "MANAGE";
ui.page.header = "SOON.UI MANAGE";

pageInit({
    toolbar() {
        const element = createToolbarElement();
        return ui.Toolbar({
            toolbarId: element,
            defaultExtendShow: false
        });
    },
    created() {
        this.gridView = createGridview();
    },
    layout() {
        const height = this.contentBodyHeight;
        const toolbarHeight = this.toolbar.height;
        if(this.gridView) {
            this.gridView.setSize(height - toolbarHeight);
        }
    }
});

function createToolbarElement() {
    const toolbarBuilder = createToolbarBuilder();
    bodyAppend(toolbarBuilder.element);

    return toolbarBuilder.element;
}

function createGridview() {
    const element = document.createElement("div");
    bodyAppend(element);

    return ui.ctrls.GridView({
        columns: [
            { text: "#", align: "right", len: 40, formatter: ui.ColumnStyle.cfn.rowNumber },
            { text: ui.ColumnStyle.cnfn.checkAll, align: "center", len: 40, formatter: ui.ColumnStyle.cfn.check },
            { text: "姓名", column: "name", len: 100 },
            { text: "姓名", column: "name", len: 100 },
            { text: "姓名", column: "name", len: 100 },
            { text: "姓名", column: "name", len: 100 },
            { text: "姓名", column: "name", len: 100 },
            { formatter: ui.ColumnStyle.empty }
        ]
    }, element);
}