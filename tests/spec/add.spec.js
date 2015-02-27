/*jshint onevar:false */

//for node
var byroads = byroads || require('../../dist/byroads');
//end node


describe('byroads.addRoute()', function(){

    beforeEach(function(){
        // specs are run out of order since we check the amount of routes
        // added we need to make sure other tests won't mess up these results
        // otherwise we might spend time trying to debug the wrong issues
        byroads.removeAllRoutes();
    });

    afterEach(function(){
        byroads.removeAllRoutes();
    });


    it('should return a route and attach it to byroads', function(){

        var s = byroads.addRoute('/{foo}');

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( byroads.getNumRoutes() ).toBe( 1 );

    });

    it('should add listener to matched if provided', function(){

        var s = byroads.addRoute('/{foo}');

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( byroads.getNumRoutes() ).toBe( 1 );

    });

    it('should accept RegExp', function(){

        var s = byroads.addRoute(/^foo\/([a-z]+)$/);

        expect( s ).toBeDefined();
        expect( s.rules ).toBeUndefined();
        expect( byroads.getNumRoutes() ).toBe( 1 );

    });

    it('should increment num routes', function(){

        var s1 = byroads.addRoute(/^foo\/([a-z]+)$/);

        var s2 = byroads.addRoute('/{foo}');

        expect( s1 ).toBeDefined();
        expect( s2 ).toBeDefined();
        expect( s1.rules ).toBeUndefined();
        expect( s2.rules ).toBeUndefined();
        expect( byroads.getNumRoutes() ).toBe( 2 );

    });

    it('should work on multiple instances', function(){

        var s1 = byroads.addRoute('/bar');
        var cr = byroads.create();
        var s2 = cr.addRoute('/ipsum');

        expect( s1 ).toBeDefined();
        expect( s2 ).toBeDefined();
        expect( s1.rules ).toBeUndefined();
        expect( s2.rules ).toBeUndefined();
        expect( byroads.getNumRoutes() ).toBe( 1 );
        expect( cr.getNumRoutes() ).toBe( 1 );

    });

});
