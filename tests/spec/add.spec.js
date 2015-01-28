/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
//end node


describe('urlParser.addRoute()', function(){

    beforeEach(function(){
        // specs are run out of order since we check the amount of routes
        // added we need to make sure other tests won't mess up these results
        // otherwise we might spend time trying to debug the wrong issues
        urlParser.removeAllRoutes();
        urlParser.resetState();
    });

    afterEach(function(){
        urlParser.removeAllRoutes();
        urlParser.resetState();
    });


    it('should return a route and attach it to urlParser', function(){

        var s = urlParser.addRoute('/{foo}');

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( urlParser.getNumRoutes() ).toBe( 1 );
        expect( s.matched.getNumListeners() ).toBe( 0 );

    });

    it('should add listener to matched if provided', function(){

        var s = urlParser.addRoute('/{foo}', function(){
            expect().toBe('shouldnt be called');
        });

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( urlParser.getNumRoutes() ).toBe( 1 );
        expect( s.matched.getNumListeners() ).toBe( 1 );

    });

    it('should accept RegExp', function(){

        var s = urlParser.addRoute(/^foo\/([a-z]+)$/, function(){
            expect().toBe('shouldnt be called');
        });

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( urlParser.getNumRoutes() ).toBe( 1 );
        expect( s.matched.getNumListeners() ).toBe( 1 );

    });

    it('should increment num routes', function(){

        var s1 = urlParser.addRoute(/^foo\/([a-z]+)$/, function(){
            expect().toBe('shouldnt be called');
        });

        var s2 = urlParser.addRoute('/{foo}', function(){
            expect().toBe('shouldnt be called');
        });

        expect( s1 ).toBeDefined();
        expect( s2 ).toBeDefined();
        expect( s1.rules ).toBeUndefined();
        expect( s2.rules ).toBeUndefined();
        expect( urlParser.getNumRoutes() ).toBe( 2 );
        expect( s1.matched.getNumListeners() ).toBe( 1 );
        expect( s2.matched.getNumListeners() ).toBe( 1 );

    });

    it('should work on multiple instances', function(){

        var s1 = urlParser.addRoute('/bar');
        var cr = urlParser.create();
        var s2 = cr.addRoute('/ipsum');

        expect( s1 ).toBeDefined();
        expect( s2 ).toBeDefined();
        expect( s1.rules ).toBeUndefined();
        expect( s2.rules ).toBeUndefined();
        expect( urlParser.getNumRoutes() ).toBe( 1 );
        expect( cr.getNumRoutes() ).toBe( 1 );
        expect( s1.matched.getNumListeners() ).toBe( 0 );
        expect( s2.matched.getNumListeners() ).toBe( 0 );

    });

});
