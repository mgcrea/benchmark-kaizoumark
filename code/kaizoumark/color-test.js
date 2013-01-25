// Color transitions test

(function(){

if(!window.Kaizoumark){ 
    return;
}

var startAnimation = function(index, useGradient){
    var nbCols = Math.pow(2,index-1);
    var fwidth = Math.round(Kaizoumark.contWidth/nbCols);
    var fheight = Math.round(Kaizoumark.contHeight/nbCols);
    Kaizoumark.container.style[Modernizr.prefixed('columnCount')] = nbCols;
    Kaizoumark.container.style[Modernizr.prefixed('columnGap')] = '0px';
    var ndivs = nbCols*nbCols;
    Kaizoumark.container.innerHTML = "";	  
    var divs = new Array();
    for(var i=0; i<ndivs; i++) {
      var div= document.createElement("div");
      div.width = fwidth;
      div.height = fheight;
      div.style['position'] = 'relative';
      div.style['width'] = div.width + "px";
      div.style['height'] = div.height + "px";
      div.style['backgroundColor'] = "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
      div.style['margin'] = '0px';
      div.style['padding'] = '0px';
      if(useGradient){
        var gradient = "(top,";
        gradient += "rgba(" + Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5),";
        gradient += "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5))";
        div.style['backgroundImage'] = "-webkit-linear-gradient" + gradient;
      }
      div.style[Modernizr.prefixed('transition')] = "all 0.5s linear";
      Kaizoumark.container.appendChild(div);
      divs.push(div);
    }
    this.moveInterval = setInterval(function () {
      for (var i=0, l= divs.length; i< l; i++){
        divs[i].style['backgroundColor'] = "rgb("+ Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+")";
      }    
    },1000);
};
  
var endAnimation = function(){
  clearInterval(this.moveInterval);
  Kaizoumark.container.style[Modernizr.prefixed('columnCount')] = 1;
};

var start = function(index) {
    startAnimation(index,false);
};

var startWithGradient = function(index) {
    startAnimation(index,true);
};

var stop = function() {
    endAnimation();
};

Kaizoumark.register('Colors',['csstransitions','csscolumns'],start,stop);
Kaizoumark.register('Colors & gradients',['csstransitions','csscolumns','cssgradients'],startWithGradient,stop);

})();
