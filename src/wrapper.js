//::LICENSE:://
;(function () {
var factory = function () {
//::INTRO_JS:://
//::URLPARSER_JS:://
//::ROUTE_JS:://
//::LEXER_JS:://
    return byroads;
};

if (typeof define === 'function' && define.amd) {
    define([], factory);
} else if (typeof module !== 'undefined' && module.exports) { //Node
    module.exports = factory(require());
} else {
    /*jshint sub:true */
    window['byroads'] = factory();
}

}());

