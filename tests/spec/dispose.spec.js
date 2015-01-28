/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
//end node



describe('Route.dispose()', function(){

    afterEach(function(){
        urlParser.resetState();
        urlParser.removeAllRoutes();
    });


    it('should dispose route', function(){
        var count = 0;

        var a = urlParser.addRoute('{foo}/{bar}');
        a.matched.add(function(foo, bar){
            count++;
        });

        urlParser.parse('foo/bar');
        a.dispose();
        urlParser.parse('dolor/amet');
        expect( count ).toBe( 1 );
    });

});
