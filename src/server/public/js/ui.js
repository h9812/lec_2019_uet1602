const tabs = ["config", "route"];

function onload() {
    // hide other tab
    tabs.forEach((tab) => {
        if (tab != tabs[0]) {
            $("#" + tab).hide();
        }
    })
    // first tab is active
    $(`#${tabs[0]}-tabbtn`).addClass("active-tab-btn");
}

function openTab(evt, tabName) {
    // hide other tab
    tabs.forEach((tab) => {
        if (tab != tabName) {
            $("#" + tab).hide();
            $("#" + tab + "-tabbtn").removeClass("active-tab-btn");
        }
    })
    // show tab and set active
    $("#" + tabName).show();
    $(evt).addClass("active-tab-btn");

}

function inputClear() {
    $("#route-textarea").val("");
}