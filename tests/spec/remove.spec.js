/*jshint onevar:false */

//for node
var byroads = byroads || require('../../dist/byroads');
//end node



describe('byroads.toString() and route.toString()', function(){

    beforeEach(function(){
        byroads.removeAllRoutes();
    });



    describe('byroads.removeRoute()', function(){

        it('should remove by reference', function(){
            var a = byroads.addRoute('/{foo}_{bar}');
  
            expect( byroads.getNumRoutes() ).toBe( 1 );
            byroads.removeRoute(a);
            expect( byroads.getNumRoutes() ).toBe( 0 );
        });

    });



    describe('byroads.removeAll()', function(){

        it('should removeAll', function(){
            var a = byroads.addRoute('/{foo}/{bar}');
            var b = byroads.addRoute('/{foo}_{bar}');

            expect( byroads.getNumRoutes() ).toBe( 2 );
            byroads.removeAllRoutes();
            expect( byroads.getNumRoutes() ).toBe( 0 );
        });

    });


});
