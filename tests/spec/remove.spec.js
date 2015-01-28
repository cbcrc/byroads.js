/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
//end node



describe('urlParser.toString() and route.toString()', function(){

    beforeEach(function(){
        urlParser.resetState();
        urlParser.removeAllRoutes();
    });



    describe('urlParser.removeRoute()', function(){

        it('should remove by reference', function(){
            var t1, t2, t3, t4;

            var a = urlParser.addRoute('/{foo}_{bar}');
            a.matched.add(function(foo, bar){
                t1 = foo;
                t2 = bar;
            });
            urlParser.parse('/lorem_ipsum');
            urlParser.removeRoute(a);
            urlParser.parse('/foo_bar');

            expect( t1 ).toBe( 'lorem' );
            expect( t2 ).toBe( 'ipsum' );
        });

    });



    describe('urlParser.removeAll()', function(){

        it('should removeAll', function(){
            var t1, t2, t3, t4;

            var a = urlParser.addRoute('/{foo}/{bar}');
            a.matched.add(function(foo, bar){
                t1 = foo;
                t2 = bar;
            });

            var b = urlParser.addRoute('/{foo}_{bar}');
            b.matched.add(function(foo, bar){
                t1 = foo;
                t2 = bar;
            });

            expect( urlParser.getNumRoutes() ).toBe( 2 );
            urlParser.removeAllRoutes();
            expect( urlParser.getNumRoutes() ).toBe( 0 );

            urlParser.parse('/lorem/ipsum');
            urlParser.parse('/foo_bar');

            expect( t1 ).toBeUndefined();
            expect( t2 ).toBeUndefined();
            expect( t3 ).toBeUndefined();
            expect( t4 ).toBeUndefined();
        });

    });


});
