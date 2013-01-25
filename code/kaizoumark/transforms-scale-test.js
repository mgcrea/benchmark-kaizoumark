// Frame transitions test

(function(){

if(!window.Kaizoumark){ 
    return;
}

var FRAME_HEIGHT = 100;
var FRAME_WIDTH = 100;
var moveInterval = null;

// kaizoumark test call-backs
var startAnimation = function(index,useOpacity){
    var nbDivs = Math.pow(2,index-1);
    Kaizoumark.container.innerHTML = "";	  
    var divs = new Array();
    for(var i=0; i<nbDivs; i++) {
      var div= document.createElement("div");
      div.left = Math.round((Math.random()*(Kaizoumark.contWidth-FRAME_WIDTH)));
      div.top = Math.round((Math.random()*(Kaizoumark.contHeight-FRAME_HEIGHT)));
      div.width = FRAME_WIDTH;
      div.height = FRAME_HEIGHT;
      div.style['position'] = 'absolute';
      div.style['left'] = div.left + "px";
      div.style['top'] = div.top + "px";
      div.style['width'] = div.width + "px";
      div.style['height'] = div.height + "px";
      div.style['backgroundColor'] = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
      div.style[Modernizr.prefixed('transition')] = "all 0.5s ease-in-out";
      Kaizoumark.container.appendChild(div);
      divs.push(div);
    }
    var moveInterval = setInterval(
    function () {
      for (var i=0, l= divs.length; i< l; i++){
        var centerLeft = divs[i].left + Math.round(divs[i].width/2);
        var maxScaleRight = (Kaizoumark.contWidth - centerLeft)/(divs[i].width/2);
        var maxScaleLeft = centerLeft/(divs[i].width/2);
        var maxScaleHorz = Math.min(maxScaleRight,maxScaleLeft);
        var centerTop = divs[i].top + Math.round(divs[i].height/2);
        var maxScaleTop = (Kaizoumark.contHeight - centerTop)/(divs[i].height/2);
        var maxScaleBottom = centerTop/(divs[i].height/2);
        var maxScaleVert = Math.min(maxScaleTop,maxScaleBottom);
        divs[i].style[Modernizr.prefixed('transform')] = 'scale(' + Math.random()*Math.min(maxScaleHorz,maxScaleVert)+')';
        if(useOpacity){
            divs[i].style.opacity = Math.round(Math.random() * 100) / 100;
        }
      }    
    },500);
};
  
var endAnimation = function(){
  clearInterval(moveInterval);
};

var start = function(index) {
    startAnimation(index,false);
};

var startWithOpacity = function(index) {
    startAnimation(index,true);
};

var stop = function() {
    endAnimation();
};

Kaizoumark.register('Transforms: scale',['csstransitions','csstransforms'],start,stop);
Kaizoumark.register('Transforms: scale (with opacity)',['csstransitions','csstransforms'],startWithOpacity,stop);

})();
