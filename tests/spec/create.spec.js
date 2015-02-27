/*jshint onevar:false */

//for node
var byroads = byroads || require('../../dist/byroads');
var jasmineHelper = jasmineHelper || require('../lib/jasmine-helper');
//end node

describe('byroads.create()', function(){

    afterEach(function(){
        byroads.removeAllRoutes();
    });


    describe('new Router instance', function(){

        it('should work in new instances', function(){
            var parser = byroads.create();

            var r1 = parser.addRoute('/{foo}');

            var matches = jasmineHelper.getMatches(parser, '/lorem_ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(1);
            expect(params[0]).toEqual('lorem_ipsum');
        });


        it('shouldn\'t affect static instance', function(){
            var parser = byroads.create();

            var r2 = byroads.addRoute('/{foo}');
            var r1 = parser.addRoute('/{foo}');

            expect(byroads.getNumRoutes()).toEqual(1);
            expect(parser.getNumRoutes()).toEqual(1);

            var matches = jasmineHelper.getMatches(parser, '/lorem_ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(1);
            expect(params[0]).toEqual('lorem_ipsum');
        });


        it('shouldn\'t be affected by static instance', function(){
            var parser = byroads.create();

            var r1 = byroads.addRoute('/{foo}');
            var r2 = parser.addRoute('/{foo}');

            expect(byroads.getNumRoutes()).toEqual(1);
            expect(parser.getNumRoutes()).toEqual(1);

            var matches = jasmineHelper.getMatches(byroads, '/lorem_ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(1);
            expect(params[0]).toEqual('lorem_ipsum');
        });


        it('should allow a different lexer per router', function () {
            var cr = byroads.create();
            var count = 0;
            cr.patternLexer = {
                getParamIds : function(){
                    return ['a','b'];
                },
                getOptionalParamsIds : function(){
                    return [];
                },
                getParamValues : function(){
                    return [123, 456];
                },
                compilePattern : function(){
                    return (/foo-bar/);
                }
            };
            var vals = [];
            var inc = function(a, b){
                vals[0] = a;
                vals[1] = b;
                count++;
            };
            cr.addRoute('test', inc);
            cr.parse('foo-bar');
            expect( count ).toEqual( 1 );
            expect( vals ).toEqual( [123, 456] );
            expect( cr.patternLexer ).not.toBe( byroads.patternLexer );
        });


    });

});
