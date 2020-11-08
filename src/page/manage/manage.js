import style from "./manage.css";

import ui from "soonui";
import { pageSettings, pageInit, bodyAppend } from "../../common/layout/menu-layout";
import { createToolbarBuilder } from "../../common/components/toolbar";

pageSettings({
    title: "MANAGE",
    header: "SOON.UI MANAGE",
    showHomeButton: true
});

pageInit({
    menu: true,
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
    },
    load() {
        loadMenuData();
        loadGridviewData();
    }
});

function createToolbarElement() {
    const toolbarBuilder = createToolbarBuilder();
    toolbarBuilder.addTools([
        {
            type: "actionButton",
            buttons: [
                {
                    id: "add",
                    text: "添加",
                    icon: "<i class='fa fa-plus'></i>",
                    handler: function() {
                        ui.messageShow("add new data.");
                    }
                }
            ]
        }
    ], true);
    bodyAppend(toolbarBuilder.element);

    return toolbarBuilder.element;
}

function createGridview() {
    const element = document.createElement("div");
    bodyAppend(element);

    const gridview = ui.ctrls.GridView({
        columns: [
            { text: "#", align: "right", len: 60, formatter: ui.ColumnStyle.cfn.rowNumber },
            { text: ui.ColumnStyle.cnfn.checkAll, align: "center", len: 40, formatter: ui.ColumnStyle.cfn.check },
            { text: "姓名", column: "name", len: 100 },
            { text: "年龄", column: "age", len: 100, align: "center" },
            { text: "电话", column: "phone", len: 120, align: "center", formatter: ui.ColumnStyle.cfn.cellPhone },
            { text: "状态", column: "status", len: 100, align: "center", formatter: ui.ColumnStyle.cfnp.getBooleanFormatter("启用", "禁用") },
            { text: "日期时间", column: "dateValue", len: 160, align: "center", formatter: ui.ColumnStyle.cfn.datetime },
            { formatter: ui.ColumnStyle.empty }
        ],
        selection: {
            type: "row",
            multiple: false,
            isRelateCheckbox: false
        }
    }, element);

    gridview.pagechanging(function(e, pageIndex, pageSize) {
        loadGridviewData(pageIndex);
    });

    return gridview;
}

function loadMenuData() {
    ui.page.menu.setMenuList([
        {
            resourceCode: "1",
            resourceName: "HOME",
            icon: "/content/icon/sys-setting.png",
            url: "/home.html",
            children: null
        }
    ]);
}

function loadGridviewData(pageIndex) {
    if(!ui.core.isNumber(pageIndex)) {
        ui.page.gridView.pageIndex = 1;
    }

    const viewData = [];
    for(let i = 0; i < 20; i++) {
        viewData.push({
            name: "姓名" + (i + 1),
            age: ui.random.getNum(1, 150),
            dateValue: new Date(),
            phone: "18662718995",
            status: !!ui.random.getNum(0, 2)
        });
    }

    ui.page.gridView.createBody(viewData, 1052);
}