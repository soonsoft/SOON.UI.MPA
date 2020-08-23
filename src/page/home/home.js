//$(document.body).html("<h1>HELLO WORLD</h1>");

import style from "./home.css";

import $ from "jquery";
import ui from "soonui";

const h1 = document.createElement("h1");
h1.innerText = "HELLO WORLD";

document.body.appendChild(h1);

$(document.body).append("<h2>I AM jQuery</h2>");

console.log(ui.version);
console.log($(document).jquery, "jQuery");