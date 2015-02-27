/*jshint onevar:false */

//for node
var byroads = byroads || require('../../dist/byroads');
var jasmineHelper = jasmineHelper || require('../lib/jasmine-helper');
//end node


describe('Route.dispose()', function() {

    afterEach(function() {
        byroads.removeAllRoutes();
    });


    it('should dispose route', function() {

        var r1 = byroads.addRoute('{foo}/{bar}');
        expect(byroads.getNumRoutes()).toEqual(1);

        var matches = jasmineHelper.getMatches(byroads, 'foo/bar');
        expect(matches).toBeDefined();
        expect(matches.length).toEqual(1);
        var matchedRoutes = jasmineHelper.toRoutes(matches);
        expect(matchedRoutes).toContain(r1);

        r1.dispose();

        expect(byroads.getNumRoutes()).toEqual(0);

        matches = jasmineHelper.getMatches(byroads, 'foo/bar');
        expect(matches).toBeDefined();
        expect(matches.length).toEqual(0);

    });

});
