//$(document.body).html("<h1>HELLO WORLD</h1>");

import style from "./home.css";

import ui from "soonui";
import { pageInit } from "../master/layout-master";

pageInit({
    create: function() {
        const h1 = document.createElement("h1");
        h1.innerText = "HELLO WORLD";

        const bodyContent = document.getElementById("body");
        body.appendChild(h1);
    }
});

// const h1 = document.createElement("h1");
// h1.innerText = "HELLO WORLD";

// document.body.appendChild(h1);

// $(document.body).append("<h2>I AM jQuery</h2>");

// console.log(ui.version);
// console.log($(document).jquery, "jQuery");