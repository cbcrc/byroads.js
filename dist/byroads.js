// Copyright (c) CBC/Radio-Canada. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/** @license
 * byroads.js <https://github.com/cbcrc/byroads.js>
 * Author: Maxime Séguin | MIT License
 * v0.1.0 (2015/04/13 17:52)
 */

/**
 * Most of the code comes from Crossroads.js
 */
 
/** @license
 * crossroads <http://millermedeiros.github.com/crossroads.js/>
 * Author: Miller Medeiros | MIT License
 * v0.12.0 (2013/01/21 13:47)
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
  }
}(this, function () {
var byroads,
    _hasOptionalGroupBug,
    UNDEF;

// Helpers -----------
//====================

// IE 7-8 capture optional groups as empty strings while other browsers
// capture as `undefined`
_hasOptionalGroupBug = (/t(.+)?/).exec('t')[1] === '';

function arrayIndexOf(arr, val) {
    if (arr.indexOf) {
        return arr.indexOf(val);
    } else {
        //Array.indexOf doesn't work on IE 6-7
        var n = arr.length;
        while (n--) {
            if (arr[n] === val) {
                return n;
            }
        }
        return -1;
    }
}

function arrayRemove(arr, item) {
    var i = arrayIndexOf(arr, item);
    if (i !== -1) {
        arr.splice(i, 1);
    }
}

function isKind(val, kind) {
    return '[object ' + kind + ']' === Object.prototype.toString.call(val);
}

function isRegExp(val) {
    return isKind(val, 'RegExp');
}

function isArray(val) {
    return isKind(val, 'Array');
}

function isFunction(val) {
    return typeof val === 'function';
}

//borrowed from AMD-utils
function typecastValue(val) {
    var r;
    if (val === null || val === 'null') {
        r = null;
    } else if (val === 'true') {
        r = true;
    } else if (val === 'false') {
        r = false;
    } else if (val === UNDEF || val === 'undefined') {
        r = UNDEF;
    } else if (val === '' || isNaN(val)) {
        //isNaN('') returns false
        r = val;
    } else {
        //parseFloat(null || '') returns NaN
        r = parseFloat(val);
    }
    return r;
}

function typecastArrayValues(values) {
    var n = values.length,
        result = [];
    while (n--) {
        result[n] = typecastValue(values[n]);
    }
    return result;
}

//borrowed from AMD-Utils
function decodeQueryString(str, shouldTypecast) {
    var queryArr = (str || '').replace('?', '').split('&'),
        n = queryArr.length,
        obj = {},
        item, val;
    while (n--) {
        item = queryArr[n].split('=');
        val = shouldTypecast ? typecastValue(item[1]) : item[1];
        obj[item[0]] = (typeof val === 'string') ? decodeURIComponent(val) : val;
    }
    return obj;
}

// Byroads --------
//====================

/**
 * @constructor
 */
function Byroads() {
    this._routes = [];
}

Byroads.prototype = {

    ignoreCase: true,

    shouldTypecast: false,

    normalizeFn: null,

    create: function() {
        return new Byroads();
    },

    addRoute: function(pattern, priority) {
        var route = new Route(pattern, priority, this);
        this._sortedInsert(route);
        return route;
    },

    removeRoute: function(route) {
        arrayRemove(this._routes, route);
    },

    removeAllRoutes: function() {
        this._routes.length = 0;
    },

    getNumRoutes: function() {
        return this._routes.length;
    },

    _sortedInsert: function(route) {
        //simplified insertion sort
        var routes = this._routes,
            n = routes.length;
        do {
            --n;
        } while (routes[n] && route._priority <= routes[n]._priority);
        routes.splice(n + 1, 0, route);
    },

    getMatchedRoutes: function(request, returnAllMatchedRoutes) {
        request = request || '';

        var res = [],
            routes = this._routes,
            n = routes.length,
            route;

        //should be decrement loop since higher priorities are added at the end of array
        while (route = routes[--n]) {
            if ((!res.length || returnAllMatchedRoutes) && route.match(request)) {
                res.push({
                    route: route,
                    params: route._getParamsArray(request)
                });
            }
            if (!returnAllMatchedRoutes && res.length) {
                break;
            }
        }
        return res;
    },

    toString: function() {
        return '[byroads numRoutes:' + this.getNumRoutes() + ']';
    }
};

//"static" instance
byroads = new Byroads();
byroads.VERSION = '0.1.0';

byroads.NORM_AS_ARRAY = function(req, vals) {
    return [vals.vals_];
};

byroads.NORM_AS_OBJECT = function(req, vals) {
    return [vals];
};

// Route --------------
//=====================

/**
 * @constructor
 */
function Route(pattern, priority, router) {
    var isRegexPattern = isRegExp(pattern),
        patternLexer = router.patternLexer;
    this._router = router;
    this._pattern = pattern;
    this._paramsIds = isRegexPattern ? null : patternLexer.getParamIds(pattern);
    this._optionalParamsIds = isRegexPattern ? null : patternLexer.getOptionalParamsIds(pattern);
    this._matchRegexp = isRegexPattern ? pattern : patternLexer.compilePattern(pattern, router.ignoreCase);
    this._priority = priority || 0;
}

Route.prototype = {

    rules: void(0),

    match: function(request) {
        request = request || '';
        return this._matchRegexp.test(request) && this._validateParams(request); //validate params even if regexp because of `request_` rule.
    },

    _validateParams: function(request) {
        var rules = this.rules,
            values = this._getParamsObject(request),
            key;
        for (key in rules) {
            // normalize_ isn't a validation rule... (#39)
            if (key !== 'normalize_' && rules.hasOwnProperty(key) && !this._isValidParam(request, key, values)) {
                return false;
            }
        }
        return true;
    },

    _isValidParam: function(request, prop, values) {
        var validationRule = this.rules[prop],
            val = values[prop],
            isValid = false,
            isQuery = (prop.indexOf('?') === 0);

        if (val == null && this._optionalParamsIds && arrayIndexOf(this._optionalParamsIds, prop) !== -1) {
            isValid = true;
        } else if (isRegExp(validationRule)) {
            if (isQuery) {
                val = values[prop + '_']; //use raw string
            }
            isValid = validationRule.test(val);
        } else if (isArray(validationRule)) {
            if (isQuery) {
                val = values[prop + '_']; //use raw string
            }
            isValid = this._isValidArrayRule(validationRule, val);
        } else if (isFunction(validationRule)) {
            isValid = validationRule(val, request, values);
        }

        return isValid; //fail silently if validationRule is from an unsupported type
    },

    _isValidArrayRule: function(arr, val) {
        if (!this._router.ignoreCase) {
            return arrayIndexOf(arr, val) !== -1;
        }

        if (typeof val === 'string') {
            val = val.toLowerCase();
        }

        var n = arr.length,
            item,
            compareVal;

        while (n--) {
            item = arr[n];
            compareVal = (typeof item === 'string') ? item.toLowerCase() : item;
            if (compareVal === val) {
                return true;
            }
        }
        return false;
    },

    _getParamsObject: function(request) {
        var shouldTypecast = this._router.shouldTypecast,
            values = this._router.patternLexer.getParamValues(request, this._matchRegexp, shouldTypecast),
            o = {},
            n = values.length,
            param, val;
        while (n--) {
            val = values[n];
            if (this._paramsIds) {
                param = this._paramsIds[n];
                if (param.indexOf('?') === 0 && val) {
                    //make a copy of the original string so array and
                    //RegExp validation can be applied properly
                    o[param + '_'] = val;
                    //update vals_ array as well since it will be used
                    //during dispatch
                    val = decodeQueryString(val, shouldTypecast);
                    values[n] = val;
                }
                // IE will capture optional groups as empty strings while other
                // browsers will capture `undefined` so normalize behavior.
                // see: #gh-58, #gh-59, #gh-60
                if (_hasOptionalGroupBug && val === '' && arrayIndexOf(this._optionalParamsIds, param) !== -1) {
                    val = void(0);
                    values[n] = val;
                }
                o[param] = val;
            }
            //alias to paths and for RegExp pattern
            o[n] = val;
        }
        o.request_ = shouldTypecast ? typecastValue(request) : request;
        o.vals_ = values;
        return o;
    },

    _getParamsArray: function(request) {
        var norm = this.rules ? this.rules.normalize_ : null,
            params;
        norm = norm || this._router.normalizeFn; // default normalize
        if (norm && isFunction(norm)) {
            params = norm(request, this._getParamsObject(request));
        } else {
            params = this._getParamsObject(request).vals_;
        }
        return params;
    },

    interpolate: function(replacements) {
        var str = this._router.patternLexer.interpolate(this._pattern, replacements);
        if (!this._validateParams(str)) {
            throw new Error('Generated string doesn\'t validate against `Route.rules`.');
        }
        return str;
    },

    dispose: function() {
        this._router.removeRoute(this);
    },

    toString: function() {
        return '[Route pattern:"' + this._pattern + '"]';
    }

};

// Pattern Lexer ------
//=====================

Byroads.prototype.patternLexer = (function() {

    var
    //match chars that should be escaped on string regexp
        ESCAPE_CHARS_REGEXP = /[\\.+*?\^$\[\](){}\/'#]/g,

        //trailing slashes (begin/end of string)
        LOOSE_SLASHES_REGEXP = /^\/|\/$/g,
        LEGACY_SLASHES_REGEXP = /\/$/g,

        //params - everything between `{ }` or `: :`
        PARAMS_REGEXP = /(?:\{|:)([^}:]+)(?:\}|:)/g,

        //used to save params during compile (avoid escaping things that
        //shouldn't be escaped).
        TOKENS = {
            'OS': {
                //optional slashes
                //slash between `::` or `}:` or `\w:` or `:{?` or `}{?` or `\w{?`
                rgx: /([:}]|\w(?=\/))\/?(:|(?:\{\?))/g,
                save: '$1{{id}}$2',
                res: '\\/?'
            },
            'RS': {
                //required slashes
                //used to insert slash between `:{` and `}{`
                rgx: /([:}])\/?(\{)/g,
                save: '$1{{id}}$2',
                res: '\\/'
            },
            'RQ': {
                //required query string - everything in between `{? }`
                rgx: /\{\?([^}]+)\}/g,
                //everything from `?` till `#` or end of string
                res: '\\?([^#]+)'
            },
            'OQ': {
                //optional query string - everything in between `:? :`
                rgx: /:\?([^:]+):/g,
                //everything from `?` till `#` or end of string
                res: '(?:\\?([^#]*))?'
            },
            'OR': {
                //optional rest - everything in between `: *:`
                rgx: /:([^:]+)\*:/g,
                res: '(.*)?' // optional group to avoid passing empty string as captured
            },
            'RR': {
                //rest param - everything in between `{ *}`
                rgx: /\{([^}]+)\*\}/g,
                res: '(.+)'
            },
            // required/optional params should come after rest segments
            'RP': {
                //required params - everything between `{ }`
                rgx: /\{([^}]+)\}/g,
                res: '([^\\/?]+)'
            },
            'OP': {
                //optional params - everything between `: :`
                rgx: /:([^:]+):/g,
                res: '([^\\/?]+)?\/?'
            }
        },

        LOOSE_SLASH = 1,
        STRICT_SLASH = 2,
        LEGACY_SLASH = 3,

        _slashMode = LOOSE_SLASH;


    function precompileTokens() {
        var key, cur;
        for (key in TOKENS) {
            if (TOKENS.hasOwnProperty(key)) {
                cur = TOKENS[key];
                cur.id = '__CR_' + key + '__';
                cur.save = ('save' in cur) ? cur.save.replace('{{id}}', cur.id) : cur.id;
                cur.rRestore = new RegExp(cur.id, 'g');
            }
        }
    }
    precompileTokens();


    function captureVals(regex, pattern) {
        var vals = [],
            match;
        // very important to reset lastIndex since RegExp can have "g" flag
        // and multiple runs might affect the result, specially if matching
        // same string multiple times on IE 7-8
        regex.lastIndex = 0;
        while (match = regex.exec(pattern)) {
            vals.push(match[1]);
        }
        return vals;
    }

    function getParamIds(pattern) {
        return captureVals(PARAMS_REGEXP, pattern);
    }

    function getOptionalParamsIds(pattern) {
        return captureVals(TOKENS.OP.rgx, pattern);
    }

    function compilePattern(pattern, ignoreCase) {
        pattern = pattern || '';

        if (pattern) {
            if (_slashMode === LOOSE_SLASH) {
                pattern = pattern.replace(LOOSE_SLASHES_REGEXP, '');
            } else if (_slashMode === LEGACY_SLASH) {
                pattern = pattern.replace(LEGACY_SLASHES_REGEXP, '');
            }

            //save tokens
            pattern = replaceTokens(pattern, 'rgx', 'save');
            //regexp escape
            pattern = pattern.replace(ESCAPE_CHARS_REGEXP, '\\$&');
            //restore tokens
            pattern = replaceTokens(pattern, 'rRestore', 'res');

            if (_slashMode === LOOSE_SLASH) {
                pattern = '\\/?' + pattern;
            }
        }

        if (_slashMode !== STRICT_SLASH) {
            //single slash is treated as empty and end slash is optional
            pattern += '\\/?';
        }
        return new RegExp('^' + pattern + '$', ignoreCase ? 'i' : '');
    }

    function replaceTokens(pattern, regexpName, replaceName) {
        var cur, key;
        for (key in TOKENS) {
            if (TOKENS.hasOwnProperty(key)) {
                cur = TOKENS[key];
                pattern = pattern.replace(cur[regexpName], cur[replaceName]);
            }
        }
        return pattern;
    }

    function getParamValues(request, regexp, shouldTypecast) {
        var vals = regexp.exec(request);
        if (vals) {
            vals.shift();
            if (shouldTypecast) {
                vals = typecastArrayValues(vals);
            }
        }
        return vals;
    }

    function interpolate(pattern, replacements) {
        if (typeof pattern !== 'string') {
            throw new Error('Route pattern should be a string.');
        }

        var replaceFn = function(match, prop) {
            var val;
            prop = (prop.substr(0, 1) === '?') ? prop.substr(1) : prop;
            if (replacements[prop] != null) {
                if (typeof replacements[prop] === 'object') {
                    var queryParts = [];
                    for (var key in replacements[prop]) {
                        queryParts.push(encodeURI(key + '=' + replacements[prop][key]));
                    }
                    val = '?' + queryParts.join('&');
                } else {
                    // make sure value is a string see #gh-54
                    val = String(replacements[prop]);
                }

                if (match.indexOf('*') === -1 && val.indexOf('/') !== -1) {
                    throw new Error('Invalid value "' + val + '" for segment "' + match + '".');
                }
            } else if (match.indexOf('{') !== -1) {
                throw new Error('The segment ' + match + ' is required.');
            } else {
                val = '';
            }
            return val;
        };

        if (!TOKENS.OS.trail) {
            TOKENS.OS.trail = new RegExp('(?:' + TOKENS.OS.id + ')+$');
        }

        return pattern
            .replace(TOKENS.OS.rgx, TOKENS.OS.save)
            .replace(PARAMS_REGEXP, replaceFn)
            .replace(TOKENS.OS.trail, '') // remove trailing
            .replace(TOKENS.OS.rRestore, '/'); // add slash between segments
    }

    //API
    return {
        strict: function() {
            _slashMode = STRICT_SLASH;
        },
        loose: function() {
            _slashMode = LOOSE_SLASH;
        },
        legacy: function() {
            _slashMode = LEGACY_SLASH;
        },
        getParamIds: getParamIds,
        getOptionalParamsIds: getOptionalParamsIds,
        getParamValues: getParamValues,
        compilePattern: compilePattern,
        interpolate: interpolate
    };

}());

    return byroads;
}));