/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/byroads');
var jasmineHelper = jasmineHelper || require('../lib/jasmine-jasmineHelper');
//end node


describe('Route.dispose()', function() {

    afterEach(function() {
        urlParser.removeAllRoutes();
    });


    it('should dispose route', function() {

        var r1 = urlParser.addRoute('{foo}/{bar}');
        expect(urlParser.getNumRoutes()).toEqual(1);

        var matches = jasmineHelper.getMatches(urlParser, 'foo/bar');
        expect(matches).toBeDefined();
        expect(matches.length).toEqual(1);
        var matchedRoutes = jasmineHelper.toRoutes(matches);
        expect(matchedRoutes).toContain(r1);

        r1.dispose();

        expect(urlParser.getNumRoutes()).toEqual(0);

        matches = jasmineHelper.getMatches(urlParser, 'foo/bar');
        expect(matches).toBeDefined();
        expect(matches.length).toEqual(0);

    });

});
