// Color transitions test
  
function ColorTest(container,useColor){
  this.container = container;
  this.useColor = useColor;
  this.cwidth = GetFloatValueOfAttr(container,"width");
	this.cheight = GetFloatValueOfAttr(container,"height");
  this.fwidth = 100;
  this.fheight = 100;
  this.divs = null;
  this.moveInterval = null;
  this.name = "CSS 3 Transitions (colors" + (useColor ? "+gradient" : "") + ")";
  this.steps = [2,5,10,20];
}

// Mandatory kaizoumark test call-backs
ColorTest.prototype.startAnimation = function(i){
  if(i<=this.steps.length){
    var cstyle = "column-count:"+this.steps[i-1]+";";
    cstyle += "-webkit-column-count:"+this.steps[i-1]+";";
    cstyle += "-moz-column-count:"+this.steps[i-1]+";";
    cstyle += "-o-column-count:"+this.steps[i-1]+";";
    cstyle += "column-gap:0px;";
    cstyle += "-webkit-column-gap:0px;";
    cstyle += "-moz-column-gap:0px;";
    cstyle += "-o-column-gap:0px;";
    this.fwidth = Math.round(this.cwidth/this.steps[i-1]);
    this.fheight = Math.round(this.cheight/this.steps[i-1]);
    this.container.setAttribute("style",cstyle);
    var ndivs = this.steps[i-1]*this.steps[i-1];
    window.console.log(ndivs);
	  this.createDivs(ndivs);
	  var _this = this;
    this.moveInterval = setInterval(function () {
      for (var i=0, l= _this.divs.length; i< l; i++){
          var dstyle = "position:relative;";
          dstyle += "width:" + _this.fwidth+"px;";
          dstyle += "height:" + _this.fheight+"px;";
          dstyle += "background-image:" + _this.divs[i].style.backgroundImage+";";
          dstyle += "background-color:rgb("+ Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+");";
    		  _this.divs[i].setAttribute("style",dstyle);
      }    
    },1000);
    return true;
  }else{
    return false;
  }
}
  
ColorTest.prototype.endAnimation = function(){
  clearInterval(this.moveInterval);
}
    
// Internal methods
ColorTest.prototype.createDivs = function(n){
  this.container.innerHTML = "";	  
  this.divs = new Array();
  for(var i=0; i<n; i++) this.addDiv();
}

ColorTest.prototype.addDiv = function(){
  var div= document.createElement("div");
  var dstyle = "position:relative;";
  dstyle += "width:" + this.fwidth+"px;";
  dstyle += "height:" + this.fheight+"px;";
  if(this.useColor){
    dstyle += "background-image:-webkit-linear-gradient(top,";
    dstyle += "rgba(" + Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5),";
    dstyle += "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5));";
    dstyle += "background-image:-moz-linear-gradient(top,";
    dstyle += "rgba(" + Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5),";
    dstyle += "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5));";
    dstyle += "background-image:-o-linear-gradient(top,";
    dstyle += "rgba(" + Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5),";
    dstyle += "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",0.5));";
  }
  dstyle += "background-color:rgb("+ Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+");";
  div.setAttribute("style",dstyle);
  div.className = "box";
  this.container.appendChild(div);
  this.divs.push(div);
}
