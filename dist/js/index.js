"use strict";

require("core-js/modules/web.dom-collections.iterator");

const arr = [23, 44, 12];

let myFunc = a => {
  console.log("too : ".concat(a));
};

const arr2 = [...arr, 44, 1223];
myFunc(arr2[1]);