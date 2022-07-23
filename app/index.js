import clock from "clock";
import * as document from "document";
import display from "display";
import { preferences } from "user-settings";
import * as util from "../common/utils";

// Update the clock every minute
display.on ? clock.granularity = "seconds" : clock.granularity = "minutes";

// Get a handle on the <text> element
const myLabel = document.getElementById("myLabel");

// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  myLabel.text = `${hours}:${mins}`;

  if (display.on) {
    let secs = util.zeroPad(today.getSeconds());
    myLabel.text = `${hours}:${mins}:${secs}`;
  }
}
