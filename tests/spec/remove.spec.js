/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/byroad');
//end node



describe('urlParser.toString() and route.toString()', function(){

    beforeEach(function(){
        urlParser.removeAllRoutes();
    });



    describe('urlParser.removeRoute()', function(){

        it('should remove by reference', function(){
            var a = urlParser.addRoute('/{foo}_{bar}');
  
            expect( urlParser.getNumRoutes() ).toBe( 1 );
            urlParser.removeRoute(a);
            expect( urlParser.getNumRoutes() ).toBe( 0 );
        });

    });



    describe('urlParser.removeAll()', function(){

        it('should removeAll', function(){
            var a = urlParser.addRoute('/{foo}/{bar}');
            var b = urlParser.addRoute('/{foo}_{bar}');

            expect( urlParser.getNumRoutes() ).toBe( 2 );
            urlParser.removeAllRoutes();
            expect( urlParser.getNumRoutes() ).toBe( 0 );
        });

    });


});
