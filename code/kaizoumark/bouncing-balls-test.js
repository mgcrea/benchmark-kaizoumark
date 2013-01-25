// Bouncing Balls test

(function(){

if(!window.Kaizoumark){ 
    return;
}

var bb = null;

var start = function(index) {
    if (!bb) {
        bb = new BouncingBalls(Kaizoumark.container);
    }
    bb.startAnimation(index,false);
};

var stop = function() {
    bb.endAnimation();
};

Kaizoumark.register('Bouncing balls',['csstransitions','csstransforms'],start,stop,4);

})();
