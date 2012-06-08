/** 
Lightweight JSONP fetcher - www.nonobstrusive.com
The JSONP namespace provides a lightweight JSONP implementation.  This code
is implemented as-is from the code released on www.nonobtrusive.com, as per the
blog post listed below.  Only two changes were made. First, rename the json function
to get around jslint warnings. Second, remove the params functionality from that
function (not needed for my implementation).  Oh, and fixed some scoping with the jsonp
variable (didn't work with multiple calls).

http://www.nonobtrusive.com/2010/05/20/lightweight-jsonp-without-any-3rd-party-libraries/
*/
cog.jsonp = (function(){
    var counter = 0, head, query, key;
    
    function load(url) {
        var script = document.createElement('script'),
            done = false;
        script.src = url;
        script.async = true;
 
        script.onload = script.onreadystatechange = function() {
            if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                done = true;
                script.onload = script.onreadystatechange = null;
                if ( script && script.parentNode ) {
                    script.parentNode.removeChild( script );
                }
            }
        };
        if ( !head ) {
            head = document.getElementsByTagName('head')[0];
        }
        head.appendChild( script );
    } // load
    
    function clientReq(url, callback, callbackParam) {
        // apply either a ? or & to the url depending on whether we already have query params
        url += url.indexOf("?") >= 0 ? "&" : "?";

        var jsonp = "json" + (++counter);
        window[ jsonp ] = function(data){
            callback(data);
            window[ jsonp ] = null;
            try {
                delete window[ jsonp ];
            } catch (e) {}
        };
 
        load(url + (callbackParam ? callbackParam : "callback") + "=" + jsonp);
        return jsonp;
    } // clientRect

    // TODO: remove the callback, it's not needed usually, just some of the 
    // webservices that I deal with don't respond without the callback parameter
    // set (which is extremely silly, I know)
    function serverReq(url, callback, callbackParam) {
        var request = require('request'),
            requestURI = url + (url.indexOf("?") >= 0 ? "&" : "?") +
                (callbackParam ? callbackParam : 'callback') + '=cb',
            requestOpts = typeof REQUEST_OPTS != 'undefined' ? REQUEST_OPTS : {};
               
        // set the uri
        requestOpts.uri = requestURI;

        request(requestOpts, function(error, response, body) {
            if (! error) {
                var cleaned = body.replace(/^.*\(/, '').replace(/\).*$/, '');

                callback(JSON.parse(cleaned));
            }
            else {
                callback({
                    error: error
                });
            } // if..else
        });
    } // serverReq
    
    return typeof window != 'undefined' ? clientReq : serverReq;
}());