
    // Byroads --------
    //====================

    /**
     * @constructor
     */
    function Byroads() {
        this._routes = [];
    }

    Byroads.prototype = {

        ignoreCase : true,

        shouldTypecast : false,

        normalizeFn : null,

        create : function () {
            return new Byroads();
        },

        addRoute : function (pattern, priority) {
            var route = new Route(pattern, priority, this);
            this._sortedInsert(route);
            return route;
        },

        removeRoute : function (route) {
            arrayRemove(this._routes, route);
        },

        removeAllRoutes : function () {
            this._routes.length = 0;
        },

        getNumRoutes : function () {
            return this._routes.length;
        },

        _sortedInsert : function (route) {
            //simplified insertion sort
            var routes = this._routes,
                n = routes.length;
            do { --n; } while (routes[n] && route._priority <= routes[n]._priority);
            routes.splice(n+1, 0, route);
        },

        getMatchedRoutes : function (request, returnAllMatchedRoutes) {
            request = request || '';

            var res = [],
                routes = this._routes,
                n = routes.length,
                route;
                
            //should be decrement loop since higher priorities are added at the end of array
            while (route = routes[--n]) {
                if ((!res.length || returnAllMatchedRoutes) && route.match(request)) {
                    res.push({
                        route : route,
                        params : route._getParamsArray(request)
                    });
                }
                if (!returnAllMatchedRoutes && res.length) {
                    break;
                }
            }
            return res;
        },

        toString : function () {
            return '[byroads numRoutes:'+ this.getNumRoutes() +']';
        }
    };

    //"static" instance
    byroads = new Byroads();
    byroads.VERSION = '::VERSION_NUMBER::';

    byroads.NORM_AS_ARRAY = function (req, vals) {
        return [vals.vals_];
    };

    byroads.NORM_AS_OBJECT = function (req, vals) {
        return [vals];
    };
