/*jshint onevar:false */

//for node
var byroads = byroads || require('../../dist/byroads');
//end node



describe('byroads.toString() and route.toString()', function(){

    afterEach(function(){
        byroads.removeAllRoutes();
    });



    it('should help debugging', function(){
        var count = 0, requests = [];
        var a = byroads.addRoute('/{foo}_{bar}');

        expect( byroads.toString() ).toBe( '[byroads numRoutes:1]' );
        expect( a.toString() ).toBe( '[Route pattern:"/{foo}_{bar}"]' );
    });


});
