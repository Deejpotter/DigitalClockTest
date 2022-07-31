import document from "document";
import device from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };

import * as simpleActivity from "./simple/activity";
import * as simpleClock from "./simple/clock";
import * as simpleHRM from "./simple/hrm";
import * as simpleSettings from "./simple/device-settings";

let background = document.getElementById("background");
let dividers = document.getElementsByClassName("divider");
let txtTime = document.getElementById("txtTime");
let txtDate = document.getElementById("txtDate");
let txtHRM = document.getElementById("txtHRM");
let iconHRM = document.getElementById("iconHRM");
let imgHRM = iconHRM.getElementById("icon");
let statsCycle = document.getElementById("stats-cycle");
let statsCycleItems = statsCycle.getElementsByClassName("cycle-item");
const clockGranularity = "seconds";

/* --------- Gradient ---------- */
const gradientNumber = device.screen.width;
const gradientStart = 0;
let currentGradient = gradientStart;
function setGradient(seconds) {
  if (seconds > 59 || seconds == 0) {
    currentGradient = gradientStart;
  } else {
    currentGradient += gradientNumber / 60;
  }
}

/* --------- CLOCK ---------- */
function clockCallback(data) {
  txtTime.text = data.time;
  txtDate.text = data.date;
  // background.gradient.x1 = data.seconds * 2;
  // if (data.seconds) {
  setGradient(data.seconds);
  background.gradient.x1 = currentGradient;
  console.log(currentGradient);
  // }
}
simpleClock.initialize(clockGranularity, "longDate", clockCallback);

/* ------- ACTIVITY --------- */
function activityCallback(data) {
  statsCycleItems.forEach((item, index) => {
    let img = item.firstChild;
    let txt = img.nextSibling;
    txt.text = data[Object.keys(data)[index]].pretty;
    // Reposition the activity icon to the left of the variable length text
    img.x = txt.getBBox().x - txt.parent.getBBox().x - img.width - 7;
  });
}
simpleActivity.initialize(clockGranularity, activityCallback);

/* -------- HRM ------------- */
function hrmCallback(data) {
  txtHRM.text = `${data.bpm}`;
  if (data.zone === "out-of-range") {
    imgHRM.href = "images/heart_open.png";
  } else {
    imgHRM.href = "images/heart_solid.png";
  }
  if (data.bpm !== "--") {
    iconHRM.animate("highlight");
  }
}
simpleHRM.initialize(hrmCallback);

/* -------- SETTINGS -------- */
function settingsCallback(data) {
  if (!data) {
    return;
  }
  if (data.background1) {
    background.gradient.colors.c1 = data.background1;
  }
  if (data.background2) {
    background.gradient.colors.c2 = data.background2;
  }
  if (data.foreground) {
    txtTime.style.fill = data.foreground;
    txtDate.style.fill = data.foreground;
    txtHRM.style.fill = data.foreground;
    imgHRM.style.fill = data.foreground;
    statsCycleItems.forEach((item, index) => {
      let img = item.firstChild;
      let txt = img.nextSibling;
      img.style.fill = data.foreground;
      txt.style.fill = data.foreground;
    });
    dividers.forEach(item => {
      item.style.fill = data.foreground;
    });
  }
}
simpleSettings.initialize(settingsCallback);
