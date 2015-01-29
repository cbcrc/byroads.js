// JasmineHelper --------
//====================

/**
 * @constructor
 */
function JasmineHelper() {}

JasmineHelper.prototype = {
    toRoutes: function(matchedRoutes) {
        if (!matchedRoutes || !matchedRoutes.length) return matchedRoutes;

        var res = [];

        for (var i = 0; i < matchedRoutes.length; i++) {
            res.push(matchedRoutes[0].route);
        }

        return res;
    },

    getMatchedRoutes: function(parser, request, all) {
        if (typeof all === 'undefined') {
            all = true;
        }

        return this.toRoutes(parser.getMatchedRoutes(request, all));
    },

    getMatches: function(parser, request, all) {
        if (typeof all === 'undefined') {
            all = true;
        }

        return parser.getMatchedRoutes(request, all);
    }
};


//"static" instance
jasmineHelper = new JasmineHelper();
