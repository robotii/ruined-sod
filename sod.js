/**
 * Simple Object Dispatcher
 */

(function () {
    "use strict";

    var isFunction = function(o) {return Object.prototype.toString.call(o) === '[object Function]';};
    var instance;

    var sod = function (make) {

        if (typeof make === "undefined" || make === false) {
            return instance;
        }

        var self = {};
        var top = {};

        self.clear = function () { top = {}; };

        self.dispatch = function (pat, done) {
            var o = self.find(pat);
            if(isFunction(done)) {
                if (isFunction(o)) {
                    o(pat, done);
                } else {
                    done(new Error("Message not dispatched"), null);
                }
            }
        };

        self.add = function (pat, data) {
            var keys = Object.keys(pat).sort();

            var keymap = top;
            var valmap;

            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var val = pat[key];

                if (val === null || val === void 0) continue;

                valmap = keymap.v;
                if (valmap && key === keymap.k) {
                    keymap = valmap[val] || (valmap[val] = {})
                }
                else if (!keymap.k) {
                    keymap.k = key;
                    keymap.v = {};
                    keymap = keymap.v[val] = {}
                }
                else {
                    if (key < keymap.k) {
                        var curv = keymap.v;
                        var curs = keymap.s;
                        keymap.v = {};
                        keymap.s = {k: keymap.k, v: curv, s: curs};

                        keymap.k = key;
                        keymap = keymap.v[val] = {};
                    }
                    else {
                        valmap = keymap.v;
                        keymap = keymap.s || (keymap.s = {});
                        i--;
                    }
                }
            }

            if (void 0 !== data && keymap) {
                keymap.d = data;
            }

            return self;
        };

        self.findexact = function (pat) { return self.find(pat, true); };

        self.debug = function() {return top;};

        self.find = function (pat, exact) {
            var keymap = top;
            var data = null;
            var key;
            var stars = [];
            var foundkeys = {};

            do {
                key = keymap.k;

                if (keymap.v) {
                    var nextkeymap = keymap.v[pat[key]];
                    if (nextkeymap) {
                        foundkeys[key] = true;

                        if (keymap.s) {
                            stars.push(keymap.s);
                        }

                        data = nextkeymap.d || null;
                        keymap = nextkeymap;
                    }
                    else {
                        keymap = keymap.s;
                    }
                }
                else {
                    keymap = null;
                }

                if (keymap === null && data === null && stars.length > 0) {
                    keymap = stars.pop();
                }
            }
            while (keymap);

            // special case for default with no properties
            if (null === data && 0 === Object.keys(pat).length && void 0 !== top.d) {
                data = top.d;
            }

            if (exact && Object.keys(foundkeys).length !== Object.keys(pat).length) {
                data = null;
            }

            return data;
        };

        self.remove = function (pat) {
            var keymap = top;
            var data = null;
            var key;
            var path = [];

            do {
                key = keymap.k;

                if (keymap.v) {
                    var nextkeymap = keymap.v[pat[key]];
                    if (nextkeymap) {
                        path.push({km: keymap, v: pat[key]});
                        data = nextkeymap.d;
                        keymap = nextkeymap;
                    }
                    else {
                        keymap = keymap.s;
                    }
                }
                else {
                    keymap = null;
                }
            }
            while (keymap);

            if (void 0 !== data) {
                var part = path[path.length - 1];
                if (part && part.km && part.km.v) {
                    delete part.km.v[part.v].d;
                }
            }
        };

        return self;
    };

    // Make this usable in the browser as well as node.js
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = sod;
        }
    }

    // Create a singleton for later use
    instance = sod(true);

})();
