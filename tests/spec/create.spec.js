/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/byroad');
var jasmineHelper = jasmineHelper || require('../lib/jasmine-jasmineHelper');
//end node

describe('urlParser.create()', function(){

    afterEach(function(){
        urlParser.removeAllRoutes();
    });


    describe('new Router instance', function(){

        it('should work in new instances', function(){
            var parser = urlParser.create();

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
            var parser = urlParser.create();

            var r2 = urlParser.addRoute('/{foo}');
            var r1 = parser.addRoute('/{foo}');

            expect(urlParser.getNumRoutes()).toEqual(1);
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
            var parser = urlParser.create();

            var r1 = urlParser.addRoute('/{foo}');
            var r2 = parser.addRoute('/{foo}');

            expect(urlParser.getNumRoutes()).toEqual(1);
            expect(parser.getNumRoutes()).toEqual(1);

            var matches = jasmineHelper.getMatches(urlParser, '/lorem_ipsum');
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
            var cr = urlParser.create();
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
            expect( cr.patternLexer ).not.toBe( urlParser.patternLexer );
        });


    });

});
