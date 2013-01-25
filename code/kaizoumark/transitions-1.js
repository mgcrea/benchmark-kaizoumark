// Frame transitions test
  
function Transition1(container,useOpacity){
  this.container = container;
  this.useOpacity = useOpacity;
  this.cwidth = GetFloatValueOfAttr(container,"width");
	this.cheight = GetFloatValueOfAttr(container,"height");
  this.FRAME_HEIGHT = 100;
  this.FRAME_WIDTH = 100;
  this.divs = null;
  this.moveInterval = null;
  this.steps = [10,100,500,1000];
  this.name = "CSS 3 Transitions (width+height" + (useOpacity ? "+opacity" : "") + ")";
}

// Mandatory kaizoumark test call-backs
Transition1.prototype.startAnimation = function(i){
  if(i<=this.steps.length){
	  this.createDivs(this.steps[i-1]);
	  var _this = this;
    this.moveInterval = setInterval(function () {
      for (var i=0, l= _this.divs.length; i< l; i++){
        _this.divs[i].style.left= Math.round((Math.random()*(_this.cwidth-_this.FRAME_WIDTH)))+"px";
        _this.divs[i].style.top= Math.round((Math.random()*(_this.cheight-_this.FRAME_HEIGHT)))+"px";
    		_this.divs[i].style.width= Math.round((Math.random()*_this.FRAME_WIDTH))+"px";
    		_this.divs[i].style.height= Math.round((Math.random()*_this.FRAME_HEIGHT))+"px";
    		if(_this.useOpacity){
    		  _this.divs[i].style.opacity = Math.round(Math.random() * 100) / 100;
    		}
      }    
    },500);
    return true;
  }else{
    return false;
  }
}
  
Transition1.prototype.endAnimation = function(){
  clearInterval(this.moveInterval);
}
    
// Internal methods
Transition1.prototype.createDivs = function(n){
  this.container.innerHTML = "";	  
  this.divs = new Array();
  for(var i=0; i<n; i++) this.addDiv();
}

Transition1.prototype.addDiv = function(){
  var div= document.createElement("div");
  var dstyle = "position:absolute;";
  dstyle += "left:" + Math.round((Math.random()*(this.cwidth-this.FRAME_WIDTH)))+"px;";
  dstyle += "top:" + Math.round((Math.random()*(this.cheight-this.FRAME_HEIGHT)))+"px;"; 
  dstyle += "width:" + this.FRAME_WIDTH + "px;";
  dstyle += "height:" + this.FRAME_HEIGHT + "px;";
  dstyle += "background-color:rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+");";
  dstyle += "-webkit-transition: all 0.5s linear;";
  dstyle += "-moz-transition: all 0.5s linear;";
  dstyle += "-o-transition: all 0.5s linear;";
  div.setAttribute("style",dstyle);
  this.container.appendChild(div);
  this.divs.push(div);
}
