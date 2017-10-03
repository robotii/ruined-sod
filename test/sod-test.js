var assert = require('assert');
var sod = require("../sod.js");

var isFunction = function(o) {return Object.prototype.toString.call(o) === '[object Function]';};

describe("Sod", function() {
    it("should return a function", function () {
        assert(isFunction(sod));
    });
});
