import style from "./manage.css";

import ui from "soonui";
import { pageSettings, pageInit, bodyAppend } from "../../common/layout/menu-layout";
import { createToolbarBuilder } from "../../common/components/toolbar";
import { createElement, css, append, addClass, text, on } from "../../common/html/html-utils";

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
        this.contentPanel = createContentPanel();
        this.gridView = createGridView(this.contentPanel);
        this.sidePanel = createSidePanel(this.contentPanel);
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
        loadGridViewData();
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
                    icon: "<i class='far fa-plus'></i>",
                    handler: function() {
                        if(ui.page.sidePanel) {
                            ui.page.sidePanel.onAdd();
                        }
                    }
                },
                {
                    id: "remove",
                    text: "删除",
                    icon: "<i class='far fa-minus'></i>",
                    handler: function() {
                        ui.messageShow("remove the selection data.");
                    }
                }
            ]
        }
    ], true);
    bodyAppend(toolbarBuilder.element);

    return toolbarBuilder.element;
}

function createContentPanel() {
    const element = createElement("div");
    css(element, {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden"
    });
    bodyAppend(element);
    return element;
}

function createGridView(parentElement) {
    const element = document.createElement("div");
    append(parentElement, element);

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
    gridview.rebind(function() {
        ui.page.sidePanel.hide();
    });
    gridview.selected(function(e, eventData) {
        ui.page.sidePanel.onUpdate(eventData.rowData);
    });
    gridview.deselected(function() {
        ui.page.sidePanel.hide();
    });

    return gridview;
}

function createSidePanel(parentElement) {
    function createButton(content) {
        let button = createElement("button");
        addClass(button, "button");
        css(button, {
            marginRight: "10px"
        });
        text(button, content);
        return button;
    }
    
    const saveButton = createButton("保 存");
    const cancelButton = createButton("取 消");
    addClass(saveButton, "background-highlight");

    const element = createElement("div");

    const sidePanel = ui.ctrls.OptionBox({
        parent: parentElement,
        title: "编辑信息",
        width: 240,
        hasCloseButton: false,
        buttons: [saveButton, cancelButton]
    }, element);

    sidePanel.onAdd = function() {
        this.$isUpdate = false;
        this.resetForm();
        this.setTitle("新建信息");
        this.show();
    };

    sidePanel.onUpdate = function(data) {
        this.$isUpdate = true;
        this.fillForm(data);
        this.setTitle("编辑信息");
        this.show();
    };

    sidePanel.resetForm = function() {

    };

    sidePanel.fillForm = function(data) {

    };

    on(saveButton, "click", function() {
        sidePanel.hide();
    });
    on(cancelButton, "click", function() {
        sidePanel.hide();
        ui.page.gridView.cancelSelection();
    });

    return sidePanel;
    
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

function loadGridViewData(pageIndex) {
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