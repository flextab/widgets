import * as ElementPlus from "./index";

// GlobalComponents for Volar
declare module "@vue/runtime-core" {
    export interface GlobalComponents {
        ElAffix: (typeof ElementPlus)["ElAffix"];
        ElAlert: (typeof ElementPlus)["ElAlert"];
        ElAside: (typeof ElementPlus)["ElAside"];
        ElAutocomplete: (typeof ElementPlus)["ElAutocomplete"];
        ElAvatar: (typeof ElementPlus)["ElAvatar"];
        ElBacktop: (typeof ElementPlus)["ElBacktop"];
        ElBadge: (typeof ElementPlus)["ElBadge"];
        ElBreadcrumb: (typeof ElementPlus)["ElBreadcrumb"];
        ElBreadcrumbItem: (typeof ElementPlus)["ElBreadcrumbItem"];
        ElButton: (typeof ElementPlus)["ElButton"];
        ElButtonGroup: (typeof ElementPlus)["ElButtonGroup"];
        ElCalendar: (typeof ElementPlus)["ElCalendar"];
        ElCard: (typeof ElementPlus)["ElCard"];
        ElCarousel: (typeof ElementPlus)["ElCarousel"];
        ElCarouselItem: (typeof ElementPlus)["ElCarouselItem"];
        ElCascader: (typeof ElementPlus)["ElCascader"];
        ElCascaderPanel: (typeof ElementPlus)["ElCascaderPanel"];
        ElCheckbox: (typeof ElementPlus)["ElCheckbox"];
        ElCheckboxButton: (typeof ElementPlus)["ElCheckboxButton"];
        ElCheckboxGroup: (typeof ElementPlus)["ElCheckboxGroup"];
        ElCol: (typeof ElementPlus)["ElCol"];
        ElCollapse: (typeof ElementPlus)["ElCollapse"];
        ElCollapseItem: (typeof ElementPlus)["ElCollapseItem"];
        ElCollapseTransition: (typeof ElementPlus)["ElCollapseTransition"];
        ElColorPicker: (typeof ElementPlus)["ElColorPicker"];
        ElContainer: (typeof ElementPlus)["ElContainer"];
        ElConfigProvider: (typeof ElementPlus)["ElConfigProvider"];
        ElDatePicker: (typeof ElementPlus)["ElDatePicker"];
        ElDialog: (typeof ElementPlus)["ElDialog"];
        ElDivider: (typeof ElementPlus)["ElDivider"];
        ElDrawer: (typeof ElementPlus)["ElDrawer"];
        ElDropdown: (typeof ElementPlus)["ElDropdown"];
        ElDropdownItem: (typeof ElementPlus)["ElDropdownItem"];
        ElDropdownMenu: (typeof ElementPlus)["ElDropdownMenu"];
        ElEmpty: (typeof ElementPlus)["ElEmpty"];
        ElFooter: (typeof ElementPlus)["ElFooter"];
        ElForm: (typeof ElementPlus)["ElForm"];
        ElFormItem: (typeof ElementPlus)["ElFormItem"];
        ElHeader: (typeof ElementPlus)["ElHeader"];
        ElIcon: (typeof ElementPlus)["ElIcon"];
        ElImage: (typeof ElementPlus)["ElImage"];
        ElImageViewer: (typeof ElementPlus)["ElImageViewer"];
        ElInput: (typeof ElementPlus)["ElInput"];
        ElInputNumber: (typeof ElementPlus)["ElInputNumber"];
        ElLink: (typeof ElementPlus)["ElLink"];
        ElMain: (typeof ElementPlus)["ElMain"];
        ElMenu: (typeof ElementPlus)["ElMenu"];
        ElMenuItem: (typeof ElementPlus)["ElMenuItem"];
        ElMenuItemGroup: (typeof ElementPlus)["ElMenuItemGroup"];
        ElOption: (typeof ElementPlus)["ElOption"];
        ElOptionGroup: (typeof ElementPlus)["ElOptionGroup"];
        ElPageHeader: (typeof ElementPlus)["ElPageHeader"];
        ElPagination: (typeof ElementPlus)["ElPagination"];
        ElPopconfirm: (typeof ElementPlus)["ElPopconfirm"];
        ElPopper: (typeof ElementPlus)["ElPopper"];
        ElPopover: (typeof ElementPlus)["ElPopover"];
        ElProgress: (typeof ElementPlus)["ElProgress"];
        ElRadio: (typeof ElementPlus)["ElRadio"];
        ElRadioButton: (typeof ElementPlus)["ElRadioButton"];
        ElRadioGroup: (typeof ElementPlus)["ElRadioGroup"];
        ElRate: (typeof ElementPlus)["ElRate"];
        ElRow: (typeof ElementPlus)["ElRow"];
        ElScrollbar: (typeof ElementPlus)["ElScrollbar"];
        ElSelect: (typeof ElementPlus)["ElSelect"];
        ElSlider: (typeof ElementPlus)["ElSlider"];
        ElStep: (typeof ElementPlus)["ElStep"];
        ElSteps: (typeof ElementPlus)["ElSteps"];
        ElSubMenu: (typeof ElementPlus)["ElSubMenu"];
        ElSwitch: (typeof ElementPlus)["ElSwitch"];
        ElTabPane: (typeof ElementPlus)["ElTabPane"];
        ElTable: (typeof ElementPlus)["ElTable"];
        ElTableColumn: (typeof ElementPlus)["ElTableColumn"];
        ElTabs: (typeof ElementPlus)["ElTabs"];
        ElTag: (typeof ElementPlus)["ElTag"];
        ElText: (typeof ElementPlus)["ElText"];
        ElTimePicker: (typeof ElementPlus)["ElTimePicker"];
        ElTimeSelect: (typeof ElementPlus)["ElTimeSelect"];
        ElTimeline: (typeof ElementPlus)["ElTimeline"];
        ElTimelineItem: (typeof ElementPlus)["ElTimelineItem"];
        ElTooltip: (typeof ElementPlus)["ElTooltip"];
        ElTransfer: (typeof ElementPlus)["ElTransfer"];
        ElTree: (typeof ElementPlus)["ElTree"];
        ElTreeV2: (typeof ElementPlus)["ElTreeV2"];
        ElTreeSelect: (typeof ElementPlus)["ElTreeSelect"];
        ElUpload: (typeof ElementPlus)["ElUpload"];
        ElSpace: (typeof ElementPlus)["ElSpace"];
        ElSkeleton: (typeof ElementPlus)["ElSkeleton"];
        ElSkeletonItem: (typeof ElementPlus)["ElSkeletonItem"];
        ElStatistic: (typeof ElementPlus)["ElStatistic"];
        ElCheckTag: (typeof ElementPlus)["ElCheckTag"];
        ElDescriptions: (typeof ElementPlus)["ElDescriptions"];
        ElDescriptionsItem: (typeof ElementPlus)["ElDescriptionsItem"];
        ElResult: (typeof ElementPlus)["ElResult"];
        ElSelectV2: (typeof ElementPlus)["ElSelectV2"];
        ElWatermark: (typeof ElementPlus)["ElWatermark"];
    }

    interface ComponentCustomProperties {
        $message: (typeof ElementPlus)["ElMessage"];
        $notify: (typeof ElementPlus)["ElNotification"];
        $msgbox: (typeof ElementPlus)["ElMessageBox"];
        $messageBox: (typeof ElementPlus)["ElMessageBox"];
        $alert: (typeof ElementPlus)["ElMessageBox"]["alert"];
        $confirm: (typeof ElementPlus)["ElMessageBox"]["confirm"];
        $prompt: (typeof ElementPlus)["ElMessageBox"]["prompt"];
        $loading: (typeof ElementPlus)["ElLoadingService"];
    }
}

export {};