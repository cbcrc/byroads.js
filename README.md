# url-parser
Mostly code from Crossroads.js (thanks!) to extract the "matching of url pattern" (Pattern Lexer) part.

##Examples (taken from the Crossroads.js website)

###String rule with param:
####match '/news/123' passing "123" as param to handler
'/news/{id}'
 
###String rule with optional param:
####match '/foo/123/bar' passing "123" and "bar" as param
####match '/foo/45' passing 45 as param (slug is optional)
'/foo/{id}/:slug:'

 
###RegExp rule:
####match '/lorem/ipsum' passing "ipsum" as param to handler
####note the capturing group around segment
/^\/lorem\/([a-z]+)$/
 
###String rule with rest segments:
####match '/foo/123/edit' passing "123" as argument
####match '/foo/45/asd/123/edit' passing "45/asd/123" as argument
'/foo/{id*}/edit'
 
###Query String:
####match 'foo.php?lorem=ipsum&dolor=amet'
'foo.php{?query}'
