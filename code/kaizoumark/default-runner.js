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
    container.style['width'] = '1920px';
    container.style['height'] = '1080px';
    container.style['border'] = 'none';
    parentElt.appendChild(container);
    var output = document.createElement('div');
    parentElt.appendChild(output);
    var results = new Array();
    var rawResults = new Array();
    document.addEventListener("kaizoumarkResult",
        function (evt) {
            var result = evt.label + ":" + evt.level + "[" + evt.status + "]";
            results.push(result)
            var matches = evt.status.match(/^Got\s(\d+)fps/);
            var lastScore = matches && matches[1] ? evt.status.match(/^Got\s(\d+)fps/)[1] * 1 : 0;
            if (!lastScore) {
                console.warn('failed to match', evt.status);
            }
            rawResults.push({label: evt.label, level: evt.level, status: evt.status, score: evt.level * 20 + lastScore })
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
            metaScore = 0;
            for (var i=0;i<results.length;i++){
                var p = document.createElement('p');
                p.innerHTML = results[i];
                metaScore += rawResults[i].score;
                res.appendChild(p);
            }
            var h4 = document.createElement('h4');
            h4.innerHTML = "MetaScore: " + metaScore;
            res.appendChild(h4);
            parentElt.appendChild(res);
        },
        false);
    window.addEventListener('load', function(evt) {
        Kaizoumark.runAll(container,output);
    }
    ,false);
}

})();
