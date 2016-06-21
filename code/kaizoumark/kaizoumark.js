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

// kaizoumark.js

(function(){

// Test for Modernizr and fpsmeter
if(!window.Modernizr){
    alert("This test page doesn't seem to include Modernizr: aborting");
    return;
}
if(!window.FPSMeter){
    alert("This test page doesn't seem to include FPSMeter: aborting");
    return;
}

var DEFAULT_DURATION = 5;
var DEFAULT_TARGET_FPS = 20;
var DEFAULT_MAX_ITERATIONS = 100;

var self = window.Kaizoumark = {
    tests : new Array(),
    results : new Array(),
    run : function (label,
                    prerequisites,
                    startCB,
                    stopCB,
                    maxIterations,
                    duration,
                    targetFPS,
                    endCB) {
        var end = function (level,status) {
            var evt = document.createEvent("Event");
            evt.initEvent("kaizoumarkResult",true,true);
            evt.label = label;
            evt.level = level;
            evt.status = status;
            document.dispatchEvent(evt);
            FPSMeter.stop();
            endCB();
        };
        // Test for test-specific prerequisites using Modernizr
        if(prerequisites && prerequisites.length){
            for(var index in prerequisites){
                if(!Modernizr[prerequisites[index]]){
                    end(0,"Skipped: " + prerequisites[index] + " not supported");
                    return;
                }
            }
        }
        // Our main test function
        var runTest = function(index) {
            self.output.innerHTML = label + ": Run #" + index;
            fps = new Array();
            var averageArray = function(arr) {
                var avg = arr[0];
                for (var i = 1; i < arr.length; i++) {
                    avg += arr[i];
                }
                avg = Math.round(avg/arr.length);
                return avg;
            }
            setTimeout(
                function(){
                    stopCB();
                    var avgfps = averageArray(fps);
					self.container.innerHTML = "";
                    if ((avgfps>=targetFPS) && (index < maxIterations)){
                        runTest(index+1);
                    }else{
                        if (avgfps<targetFPS) {
                            end(index-1,"Got " + avgfps + "fps instead of " + targetFPS + "fps at complexity " + index);
                        } else {
                            end(index,"Maximum complexity reached");
                        }
                    }
                },duration*1000);
            startCB(index);
        };

        // Start here
        var fps = null;
        var tests = new Array();

        // Assign default values if needed
        duration = duration ? duration : DEFAULT_DURATION;
        targetFPS = targetFPS ? targetFPS : DEFAULT_TARGET_FPS;
        maxIterations = maxIterations ? maxIterations : DEFAULT_MAX_ITERATIONS;

        // Add an fps meter progress meter event listener
        document.addEventListener('fps',
            function(evt) {
                self.output.innerHTML = evt.fps + " fps";
                fps.push(evt.fps);
            },
            false);
        // Start FPS analysis
        FPSMeter.run();
        // Start test run
        runTest(1);
    },
    register : function (label,
                    prerequisites,
                    startCB,
                    stopCB,
                    maxIterations,
                    duration,
                    targetFPS) {
        self.tests.push({
            'label' : label,
            'prerequisites' : prerequisites,
            'startCB': startCB,
            'stopCB': stopCB,
            'maxIterations' : maxIterations ? maxIterations : DEFAULT_MAX_ITERATIONS,
            'duration' : duration ? duration : DEFAULT_DURATION,
            'targetFPS' : targetFPS ? targetFPS : DEFAULT_TARGET_FPS
        });
    },
    runAll : function (container,output) {
        var runNextTest = function(index) {
            if (index<self.tests.length) {
                self.run(
                    self.tests[index].label,
                    self.tests[index].prerequisites,
                    self.tests[index].startCB,
                    self.tests[index].stopCB,
                    self.tests[index].maxIterations,
                    self.tests[index].duration,
                    self.tests[index].targetFPS,
                    function () {
                        runNextTest(index+1);
                    }
                 );
            } else {
                // Notify end of tests
                var evt = document.createEvent("Event");
                evt.initEvent("kaizoumarkEnd",true,true);
                document.dispatchEvent(evt);
            }
        };
        // Explicitly set width and height attributes so that they can
        // be used by test scripts without calling getcomputedstyle
        self.container = container;
        self.contWidth = GetFloatValueOfAttr(container,'width');
        self.contHeight = GetFloatValueOfAttr(container,'height');
        self.output = output;
        runNextTest(0);
    }
};

// Utility function that really ought to be in the DOM
function GetFloatValueOfAttr (element,attr) {
    var floatValue = null;
    if (window.getComputedStyle) {
        var compStyle = window.getComputedStyle (element, null);
        try {
            var value = compStyle.getPropertyCSSValue (attr);
            var valueType = value.primitiveType;
            switch (valueType) {
              case CSSPrimitiveValue.CSS_NUMBER:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_NUMBER);
                  break;
              case CSSPrimitiveValue.CSS_PERCENTAGE:
                  floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PERCENTAGE);
                  alert ("The value of the width property: " + floatValue + "%");
                  break;
              default:
                  if (CSSPrimitiveValue.CSS_EMS <= valueType && valueType <= CSSPrimitiveValue.CSS_DIMENSION) {
                      floatValue = value.getFloatValue (CSSPrimitiveValue.CSS_PX);
                  }
            }
        }
        catch (e) {
          // Opera doesn't support the getPropertyCSSValue method
          stringValue = compStyle[attr];
          floatValue = stringValue.substring(0, stringValue.length - 2);
        }
    }
    return floatValue;
}

})();
