/*jshint onevar:false */

//for node
var urlParser = urlParser || require('../../dist/url-parser');
var jasmineHelper = jasmineHelper || require('../lib/jasmine-jasmineHelper');
//end node

describe('getMatchedRoutes()', function() {

    var _prevTypecast;


    beforeEach(function() {
        _prevTypecast = urlParser.shouldTypecast;
    });


    afterEach(function() {
        urlParser.removeAllRoutes();
        urlParser.shouldTypecast = _prevTypecast;
    });


    // ---


    describe('simple string route', function() {

        it('should route basic strings', function() {
            var route = urlParser.addRoute('/foo');

            var matchedRoutes = jasmineHelper.getMatchedRoutes(urlParser, '/bar');
            expect(matchedRoutes).toBeDefined();
            expect(matchedRoutes.length).toEqual(0);

            matchedRoutes = jasmineHelper.getMatchedRoutes(urlParser, '/foo');
            expect(matchedRoutes).toBeDefined();
            expect(matchedRoutes.length).toEqual(1);
            expect(matchedRoutes).toContain(route);

            matchedRoutes = jasmineHelper.getMatchedRoutes(urlParser, 'foo');
            expect(matchedRoutes).toBeDefined();
            expect(matchedRoutes.length).toEqual(1);
            expect(matchedRoutes).toContain(route);
        });

        it('should pass params and allow multiple routes', function() {
            var r1 = urlParser.addRoute('/{foo}');
            var r2 = urlParser.addRoute('/{foo}/{bar}');

            var matches = jasmineHelper.getMatches(urlParser, '/lorem_ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(1);
            expect(params[0]).toEqual('lorem_ipsum');

            matches = jasmineHelper.getMatches(urlParser, '/maecennas/ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r2);
            params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toEqual('maecennas');
            expect(params[1]).toEqual('ullamcor');
        });

        it('should handle a word separator that isn\'t necessarily /', function() {
            var r1 = urlParser.addRoute('/{foo}_{bar}');
            var r2 = urlParser.addRoute('/{foo}-{bar}');

            var matches = jasmineHelper.getMatches(urlParser, '/lorem_ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toEqual('lorem');
            expect(params[1]).toEqual('ipsum');

            matches = jasmineHelper.getMatches(urlParser, '/maecennas-ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r2);
            params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toEqual('maecennas');
            expect(params[1]).toEqual('ullamcor');
        });

        it('should handle empty routes', function() {
            var r1 = urlParser.addRoute();

            var matches = jasmineHelper.getMatches(urlParser, '/123/456');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser, '/maecennas/ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser, '');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(0);
        });

        it('should handle empty strings', function() {
            var r1 = urlParser.addRoute();

            var matches = jasmineHelper.getMatches(urlParser, '/123/456');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser, '/maecennas/ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser, '');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(0);
        });

        it('should route `null` as empty string', function() {
            var r1 = urlParser.addRoute('');

            var matches = jasmineHelper.getMatches(urlParser, '/123/456');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser, '/maecennas/ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);

            matches = jasmineHelper.getMatches(urlParser);
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(0);
        });
    });



    describe('optional params', function() {

        it('should capture optional params', function() {
            var r1 = urlParser.addRoute('foo/:lorem:/:ipsum:/:dolor:/:sit:');

            var matches = jasmineHelper.getMatches(urlParser, 'foo/lorem/123/true/false');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(4);
            expect(params[0]).toEqual('lorem');
            expect(params[1]).toEqual('123');
            expect(params[2]).toEqual('true');
            expect(params[3]).toEqual('false');
        });

        it('should only pass matched params', function() {
            var r1 = urlParser.addRoute('foo/:lorem:/:ipsum:/:dolor:/:sit:');

            var matches = jasmineHelper.getMatches(urlParser, 'foo/lorem/123');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(4);
            expect(params[0]).toEqual('lorem');
            expect(params[1]).toEqual('123');
            expect(params[2]).toBeUndefined();
            expect(params[3]).toBeUndefined();
        });

    });



    describe('regex route', function() {

        it('should capture groups', function() {
            //capturing groups becomes params
            var r1 = urlParser.addRoute(/^\/[0-9]+\/([0-9]+)$/);

            var matches = jasmineHelper.getMatches(urlParser, '/123/456');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(1);
            expect(params[0]).toBe('456');

            matches = jasmineHelper.getMatches(urlParser, '/maecennas/ullamcor');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(0);
        });

        it('should capture even empty groups', function() {
            //capturing groups becomes params
            var r1 = urlParser.addRoute(/^\/()\/([0-9]+)$/);

            var matches = jasmineHelper.getMatches(urlParser, '//456');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toBe('');
            expect(params[1]).toBe('456');
        });
    });



    describe('typecast values', function() {

        it('should typecast values if shouldTypecast is set to true', function() {
            urlParser.shouldTypecast = true;

            var r1 = urlParser.addRoute('{a}/{b}/{c}/{d}/{e}/{f}');

            var matches = jasmineHelper.getMatches(urlParser, 'lorem/123/true/false/null/undefined');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(6);
            expect(params[0]).toBe('lorem');
            expect(params[1]).toBe(123);
            expect(params[2]).toBe(true);
            expect(params[3]).toBe(false);
            expect(params[4]).toBe(null);
            expect(params[5]).toBe(undefined);
        });

        it('should not typecast if shouldTypecast is set to false', function() {
            urlParser.shouldTypecast = false;

            var r1 = urlParser.addRoute('{lorem}/{ipsum}/{dolor}/{sit}');

            var matches = jasmineHelper.getMatches(urlParser, 'lorem/123/true/false');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(4);
            expect(params[0]).toBe('lorem');
            expect(params[1]).toBe('123');
            expect(params[2]).toBe('true');
            expect(params[3]).toBe('false');
        });

    });


    describe('rules.normalize_', function() {

        it('should normalize params before dispatching signal', function() {
            //based on: https://github.com/millermedeiros/urlParser.js/issues/21

            var r1 = urlParser.addRoute('{a}/{b}/:c:/:d:');
            r1.rules = {
                a: ['news', 'article'],
                b: /[\-0-9a-zA-Z]+/,
                request_: /\/[0-9]+\/|$/,
                normalize_: function(request, vals) {
                    var id;
                    var idRegex = /^[0-9]+$/;
                    if (vals.a === 'article') {
                        id = vals.c;
                    } else {
                        if (idRegex.test(vals.b)) {
                            id = vals.b;
                        } else if (idRegex.test(vals.c)) {
                            id = vals.c;
                        }
                    }
                    return ['news', id]; //return params
                }
            };

            var matches = jasmineHelper.getMatches(urlParser, 'news/111/lorem-ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            var matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            var params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toBe('news');
            expect(params[1]).toBe('111');


            matches = jasmineHelper.getMatches(urlParser, 'news/foo/222/lorem-ipsum');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toBe('news');
            expect(params[1]).toBe('222');


            matches = jasmineHelper.getMatches(urlParser, 'news/333');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toBe('news');
            expect(params[1]).toBe('333');


            matches = jasmineHelper.getMatches(urlParser, 'article/news/444');
            expect(matches).toBeDefined();
            expect(matches.length).toEqual(1);
            matchedRoutes = jasmineHelper.toRoutes(matches);
            expect(matchedRoutes).toContain(r1);
            params = matches[0].params;
            expect(params).toBeDefined();
            expect(params.length).toEqual(2);
            expect(params[0]).toBe('news');
            expect(params[1]).toBe('444');
        });

    });


    describe('urlParser.normalizeFn', function() {

        var prevNorm;

        beforeEach(function() {
            prevNorm = urlParser.normalizeFn;
        });

        afterEach(function() {
            urlParser.normalizeFn = prevNorm;
        });


        it('should work as a default normalize_', function() {

            var t1, t2, t3, t4, t5, t6, t7, t8;

            urlParser.normalizeFn = function(request, vals) {
                var id;
                var idRegex = /^[0-9]+$/;
                if (vals.a === 'article') {
                    id = vals.c;
                } else {
                    if (idRegex.test(vals.b)) {
                        id = vals.b;
                    } else if (idRegex.test(vals.c)) {
                        id = vals.c;
                    }
                }
                return ['news', id]; //return params
            };

            var route1 = urlParser.addRoute('news/{b}/:c:/:d:');
            route1.matched.addOnce(function(a, b) {
                t1 = a;
                t2 = b;
            });
            getMatchedRoutes('news/111/lorem-ipsum');

            var route2 = urlParser.addRoute('{a}/{b}/:c:/:d:');
            route2.rules = {
                a: ['news', 'article'],
                b: /[\-0-9a-zA-Z]+/,
                request_: /\/[0-9]+\/|$/,
                normalize_: function(req, vals) {
                    return ['foo', vals.b];
                }
            };
            route2.matched.addOnce(function(a, b) {
                t3 = a;
                t4 = b;
            });
            getMatchedRoutes('article/333');

            expect(t1).toBe('news');
            expect(t2).toBe('111');
            expect(t3).toBe('foo');
            expect(t4).toBe('333');

        });


        it('should receive all values as an array on the special property `vals_`', function() {

            var t1, t2;

            urlParser.normalizeFn = function(request, vals) {
                //convert params into an array..
                return [vals.vals_];
            };

            urlParser.addRoute('/{a}/{b}', function(params) {
                t1 = params;
            });
            urlParser.addRoute('/{a}', function(params) {
                t2 = params;
            });

            getMatchedRoutes('/foo/bar');
            getMatchedRoutes('/foo');

            expect(t1.join(';')).toEqual(['foo', 'bar'].join(';'));
            expect(t2.join(';')).toEqual(['foo'].join(';'));

        });

        describe('NORM_AS_ARRAY', function() {

            it('should pass array', function() {
                var arg;

                urlParser.normalizeFn = urlParser.NORM_AS_ARRAY;
                urlParser.addRoute('/{a}/{b}', function(a) {
                    arg = a;
                });
                getMatchedRoutes('/foo/bar');

                expect({}.toString.call(arg)).toEqual('[object Array]');
                expect(arg[0]).toEqual('foo');
                expect(arg[1]).toEqual('bar');
            });

        });

        describe('NORM_AS_OBJECT', function() {

            it('should pass object', function() {
                var arg;

                urlParser.normalizeFn = urlParser.NORM_AS_OBJECT;
                urlParser.addRoute('/{a}/{b}', function(a) {
                    arg = a;
                });
                getMatchedRoutes('/foo/bar');

                expect(arg.a).toEqual('foo');
                expect(arg.b).toEqual('bar');
            });

        });

        describe('normalizeFn = null', function() {

            it('should pass multiple args', function() {
                var arg1, arg2;

                urlParser.normalizeFn = null;
                urlParser.addRoute('/{a}/{b}', function(a, b) {
                    arg1 = a;
                    arg2 = b;
                });
                getMatchedRoutes('/foo/bar');

                expect(arg1).toEqual('foo');
                expect(arg2).toEqual('bar');
            });

        });

    });


    describe('priority', function() {

        it('should enforce match order', function() {
            var calls = 0;

            var a = urlParser.addRoute('/{foo}/{bar}');
            a.matched.add(function(foo, bar) {
                throw new Error('shouldn\'t match but matched ' + foo + ' ' + bar);
            });

            var b = urlParser.addRoute('/{foo}/{bar}', null, 1);
            b.matched.add(function(foo, bar) {
                expect(foo).toBe('123');
                expect(bar).toBe('456');
                calls++;
            });

            getMatchedRoutes('/123/456');

            expect(calls).toBe(1);
        });

        it('shouldnt matter if there is a gap between priorities', function() {
            var calls = 0;

            var a = urlParser.addRoute('/{foo}/{bar}', function(foo, bar) {
                throw new Error('shouldn\'t match but matched ' + foo + ' ' + bar);
            }, 4);

            var b = urlParser.addRoute('/{foo}/{bar}', function(foo, bar) {
                expect(foo).toBe('123');
                expect(bar).toBe('456');
                calls++;
            }, 999);

            getMatchedRoutes('/123/456');

            expect(calls).toBe(1);
        });

    });


    describe('validate params before dispatch', function() {

        it('should ignore routes that don\'t validate', function() {
            var calls = '';

            var pattern = '{foo}-{bar}';

            var a = urlParser.addRoute(pattern);
            a.matched.add(function(foo, bar) {
                expect(foo).toBe('lorem');
                expect(bar).toBe('123');
                calls += 'a';
            });
            a.rules = {
                foo: /\w+/,
                bar: function(value, request, matches) {
                    return request === 'lorem-123';
                }
            };

            var b = urlParser.addRoute(pattern);
            b.matched.add(function(foo, bar) {
                expect(foo).toBe('123');
                expect(bar).toBe('ullamcor');
                calls += 'b';
            });
            b.rules = {
                foo: ['123', '456', '567', '2'],
                bar: /ullamcor/
            };

            getMatchedRoutes('45-ullamcor'); //first so we make sure it bypassed route `a`
            getMatchedRoutes('123-ullamcor');
            getMatchedRoutes('lorem-123');
            getMatchedRoutes('lorem-555');

            expect(calls).toBe('ba');
        });

        it('should consider invalid rules as not matching', function() {
            var pattern = '{foo}-{bar}';

            var a = urlParser.addRoute(pattern);
            a.matched.add(function(foo, bar) {
                throw new Error('first route was matched when it should not have been');
            });
            a.rules = {
                foo: 'lorem',
                bar: 123
            };

            var b = urlParser.addRoute(pattern);
            b.matched.add(function(foo, bar) {
                throw new Error('second route was matched when it should not have been');
            });
            b.rules = {
                foo: false,
                bar: void(0)
            };

            getMatchedRoutes('45-ullamcor');
            getMatchedRoutes('lorem-123');
        });

    });


    describe('greedy routes', function() {

        it('should match multiple greedy routes', function() {

            var t1, t2, t3, t4, t5, t6, t7, t8;

            var r1 = urlParser.addRoute('/{a}/{b}/', function(a, b) {
                t1 = a;
                t2 = b;
            });
            r1.greedy = false;

            var r2 = urlParser.addRoute('/bar/{b}/', function(a, b) {
                t3 = a;
                t4 = b;
            });
            r2.greedy = true;

            var r3 = urlParser.addRoute('/foo/{b}/', function(a, b) {
                t5 = a;
                t6 = b;
            });
            r3.greedy = true;

            var r4 = urlParser.addRoute('/{a}/:b:/', function(a, b) {
                t7 = a;
                t8 = b;
            });
            r4.greedy = true;

            getMatchedRoutes('/foo/lorem');

            expect(t1).toEqual('foo');
            expect(t2).toEqual('lorem');
            expect(t3).toBeUndefined();
            expect(t4).toBeUndefined();
            expect(t5).toEqual('lorem');
            expect(t6).toBeUndefined();
            expect(t7).toEqual('foo');
            expect(t8).toEqual('lorem');

        });

        it('should allow global greedy setting', function() {

            var t1, t2, t3, t4, t5, t6, t7, t8;

            urlParser.greedy = true;

            var r1 = urlParser.addRoute('/{a}/{b}/', function(a, b) {
                t1 = a;
                t2 = b;
            });

            var r2 = urlParser.addRoute('/bar/{b}/', function(a, b) {
                t3 = a;
                t4 = b;
            });

            var r3 = urlParser.addRoute('/foo/{b}/', function(a, b) {
                t5 = a;
                t6 = b;
            });

            var r4 = urlParser.addRoute('/{a}/:b:/', function(a, b) {
                t7 = a;
                t8 = b;
            });

            getMatchedRoutes('/foo/lorem');

            expect(t1).toEqual('foo');
            expect(t2).toEqual('lorem');
            expect(t3).toBeUndefined();
            expect(t4).toBeUndefined();
            expect(t5).toEqual('lorem');
            expect(t6).toBeUndefined();
            expect(t7).toEqual('foo');
            expect(t8).toEqual('lorem');

            urlParser.greedy = false;

        });

        describe('greedyEnabled', function() {

            afterEach(function() {
                urlParser.greedyEnabled = true;
            });

            it('should toggle greedy behavior', function() {
                urlParser.greedyEnabled = false;

                var t1, t2, t3, t4, t5, t6, t7, t8;

                var r1 = urlParser.addRoute('/{a}/{b}/', function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                r1.greedy = false;

                var r2 = urlParser.addRoute('/bar/{b}/', function(a, b) {
                    t3 = a;
                    t4 = b;
                });
                r2.greedy = true;

                var r3 = urlParser.addRoute('/foo/{b}/', function(a, b) {
                    t5 = a;
                    t6 = b;
                });
                r3.greedy = true;

                var r4 = urlParser.addRoute('/{a}/:b:/', function(a, b) {
                    t7 = a;
                    t8 = b;
                });
                r4.greedy = true;

                getMatchedRoutes('/foo/lorem');

                expect(t1).toEqual('foo');
                expect(t2).toEqual('lorem');
                expect(t3).toBeUndefined();
                expect(t4).toBeUndefined();
                expect(t5).toBeUndefined();
                expect(t6).toBeUndefined();
                expect(t7).toBeUndefined();
                expect(t8).toBeUndefined();
            });

        });

    });

    describe('default arguments', function() {

        it('should pass default arguments to all signals', function() {

            var t1, t2, t3, t4, t5, t6, t7, t8;

            urlParser.addRoute('foo', function(a, b) {
                t1 = a;
                t2 = b;
            });

            urlParser.bypassed.add(function(a, b, c) {
                t3 = a;
                t4 = b;
                t5 = c;
            });

            urlParser.routed.add(function(a, b, c) {
                t6 = a;
                t7 = b;
                t8 = c;
            });

            getMatchedRoutes('foo', [123, 'dolor']);
            getMatchedRoutes('bar', ['ipsum', 123]);

            expect(t1).toEqual(123);
            expect(t2).toEqual('dolor');
            expect(t3).toEqual('ipsum');
            expect(t4).toEqual(123);
            expect(t5).toEqual('bar');
            expect(t6).toEqual(123);
            expect(t7).toEqual('dolor');
            expect(t8).toEqual('foo');

        });

    });


    describe('rest params', function() {

        it('should pass rest as a single argument', function() {
            var t1, t2, t3, t4, t5, t6, t7, t8, t9;

            var r = urlParser.addRoute('{a}/{b}/:c*:');
            r.rules = {
                a: ['news', 'article'],
                b: /[\-0-9a-zA-Z]+/,
                'c*': ['foo/bar', 'edit', '123/456/789']
            };

            r.matched.addOnce(function(a, b, c) {
                t1 = a;
                t2 = b;
                t3 = c;
            });
            getMatchedRoutes('article/333');

            expect(t1).toBe('article');
            expect(t2).toBe('333');
            expect(t3).toBeUndefined();

            r.matched.addOnce(function(a, b, c) {
                t4 = a;
                t5 = b;
                t6 = c;
            });
            getMatchedRoutes('news/456/foo/bar');

            expect(t4).toBe('news');
            expect(t5).toBe('456');
            expect(t6).toBe('foo/bar');

            r.matched.addOnce(function(a, b, c) {
                t7 = a;
                t8 = b;
                t9 = c;
            });
            getMatchedRoutes('news/456/123/aaa/bbb');

            expect(t7).toBeUndefined();
            expect(t8).toBeUndefined();
            expect(t9).toBeUndefined();
        });

        it('should work in the middle of segment as well', function() {
            var t1, t2, t3, t4, t5, t6, t7, t8, t9;

            // since rest segment is greedy the last segment can't be optional
            var r = urlParser.addRoute('{a}/{b*}/{c}');
            r.rules = {
                a: ['news', 'article'],
                c: ['add', 'edit']
            };

            r.matched.addOnce(function(a, b, c) {
                t1 = a;
                t2 = b;
                t3 = c;
            });
            getMatchedRoutes('article/333/add');

            expect(t1).toBe('article');
            expect(t2).toBe('333');
            expect(t3).toBe('add');

            r.matched.addOnce(function(a, b, c) {
                t4 = a;
                t5 = b;
                t6 = c;
            });
            getMatchedRoutes('news/456/foo/bar/edit');

            expect(t4).toBe('news');
            expect(t5).toBe('456/foo/bar');
            expect(t6).toBe('edit');

            r.matched.addOnce(function(a, b, c) {
                t7 = a;
                t8 = b;
                t9 = c;
            });
            getMatchedRoutes('news/456/123/aaa/bbb');

            expect(t7).toBeUndefined();
            expect(t8).toBeUndefined();
            expect(t9).toBeUndefined();
        });

        it('should handle multiple rest params even though they dont make sense', function() {
            var calls = 0;

            var r = urlParser.addRoute('{a}/{b*}/{c*}/{d}');
            r.rules = {
                a: ['news', 'article']
            };

            r.matched.add(function(a, b, c, d) {
                expect(c).toBe('the');
                expect(d).toBe('end');
                calls++;
            });
            getMatchedRoutes('news/456/foo/bar/this/the/end');
            getMatchedRoutes('news/456/foo/bar/this/is/crazy/long/the/end');
            getMatchedRoutes('article/weather/rain-tomorrow/the/end');

            expect(calls).toBe(3);
        });

    });

    describe('query string', function() {

        describe('old syntax', function() {
            it('should only parse query string if using special capturing group', function() {
                var r = urlParser.addRoute('{a}?{q}#{hash}');
                var t1, t2, t3;
                r.matched.addOnce(function(a, b, c) {
                    t1 = a;
                    t2 = b;
                    t3 = c;
                });
                getMatchedRoutes('foo.php?foo=bar&lorem=123#bar');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual('foo=bar&lorem=123');
                expect(t3).toEqual('bar');
            });
        });

        describe('required query string after required segment', function() {
            it('should parse query string into an object and typecast vals', function() {
                urlParser.shouldTypecast = true;

                var r = urlParser.addRoute('{a}{?b}');
                var t1, t2;
                r.matched.addOnce(function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                getMatchedRoutes('foo.php?lorem=ipsum&asd=123&bar=false');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual({
                    lorem: 'ipsum',
                    asd: 123,
                    bar: false
                });
            });
        });

        describe('required query string after optional segment', function() {
            it('should parse query string into an object and typecast vals', function() {
                urlParser.shouldTypecast = true;

                var r = urlParser.addRoute(':a:{?b}');
                var t1, t2;
                r.matched.addOnce(function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                getMatchedRoutes('foo.php?lorem=ipsum&asd=123&bar=false');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual({
                    lorem: 'ipsum',
                    asd: 123,
                    bar: false
                });

                var t3, t4;
                r.matched.addOnce(function(a, b) {
                    t3 = a;
                    t4 = b;
                });
                getMatchedRoutes('?lorem=ipsum&asd=123');

                expect(t3).toBeUndefined();
                expect(t4).toEqual({
                    lorem: 'ipsum',
                    asd: 123
                });
            });
        });

        describe('optional query string after required segment', function() {
            it('should parse query string into an object and typecast vals', function() {
                urlParser.shouldTypecast = true;

                var r = urlParser.addRoute('{a}:?b:');
                var t1, t2;
                r.matched.addOnce(function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                getMatchedRoutes('foo.php?lorem=ipsum&asd=123&bar=false');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual({
                    lorem: 'ipsum',
                    asd: 123,
                    bar: false
                });

                var t3, t4;
                r.matched.addOnce(function(a, b) {
                    t3 = a;
                    t4 = b;
                });
                getMatchedRoutes('bar.php');

                expect(t3).toEqual('bar.php');
                expect(t4).toBeUndefined();
            });
        });

        describe('optional query string after optional segment', function() {
            it('should parse query string into an object and typecast vals', function() {
                urlParser.shouldTypecast = true;

                var r = urlParser.addRoute(':a::?b:');
                var t1, t2;
                r.matched.addOnce(function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                getMatchedRoutes('foo.php?lorem=ipsum&asd=123&bar=false');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual({
                    lorem: 'ipsum',
                    asd: 123,
                    bar: false
                });

                var t3, t4;
                r.matched.addOnce(function(a, b) {
                    t3 = a;
                    t4 = b;
                });
                getMatchedRoutes('bar.php');

                expect(t3).toEqual('bar.php');
                expect(t4).toBeUndefined();
            });
        });

        describe('optional query string after required segment without typecasting', function() {
            it('should parse query string into an object and not typecast vals', function() {
                var r = urlParser.addRoute('{a}:?b:');
                var t1, t2;

                r.matched.addOnce(function(a, b) {
                    t1 = a;
                    t2 = b;
                });
                getMatchedRoutes('foo.php?lorem=ipsum&asd=123&bar=false');

                expect(t1).toEqual('foo.php');
                expect(t2).toEqual({
                    lorem: 'ipsum',
                    asd: '123',
                    bar: 'false'
                });
            });
        });
    });


});
