"use strict";

const AsyncAwait = require("./async-await");
const AsyncSuffix = require("./async-suffix");

module.exports = {
    rules: {
        "async-await": AsyncAwait,
        "async-suffix": AsyncSuffix,
    },
};
