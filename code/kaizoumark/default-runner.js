// Copyright (c) 2011-2012 David Corvoysier http://www.kaizou.org
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// default-runner.js

(function(){
    
if (window.Kaizoumark) {
    var scriptTag = document.scripts[document.scripts.length - 1];
    var parentElt = scriptTag.parentNode;
    var container = document.createElement('div');
    container.style['position'] = 'relative';
    container.style['width'] = '600px';
    container.style['height'] = '500px';
    container.style['border'] = '2px solid grey';
    parentElt.appendChild(container);
    var output = document.createElement('div');
    parentElt.appendChild(output);        
    var results = new Array();
    document.addEventListener("kaizoumarkResult",
        function (evt) {
            var result = evt.label + ":" + evt.level + "[" + evt.status + "]";
            results.push(result)
        },
        false);
        document.addEventListener("kaizoumarkEnd",
        function (evt) {
            parentElt.removeChild(container);
            parentElt.removeChild(output);
            var res = document.createElement('div');
            var title = document.createElement('h3');
            title.innerHTML = "Results";
            res.appendChild(title);
            var resStr = "<h3>Results</h3>";
            var p = document.createElement('p');
            p.innerHTML = "Browser: " + BrowserDetect.browser + " " + BrowserDetect.version + "(" + BrowserDetect.OS + ")";
            res.appendChild(p);
            for (var i=0;i<results.length;i++){
                var p = document.createElement('p');
                p.innerHTML = results[i];
                res.appendChild(p);
            }
            parentElt.appendChild(res);
        },
        false);
    window.addEventListener('load', function(evt) {
        Kaizoumark.runAll(container,output);
    }
    ,false);
}

})();
