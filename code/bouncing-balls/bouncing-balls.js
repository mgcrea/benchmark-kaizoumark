// Bouncing balls animations test
  
function BouncingBalls(container){
  this.container = container;
  this.cwidth = GetFloatValueOfAttr(container,"width");
	this.cheight = GetFloatValueOfAttr(container,"height");
  this.steps = [25,50,200,500];
  this.name = "CSS 3 Animations (top+left)";
}

// Mandatory kaizoumark test call-backs
BouncingBalls.prototype.startAnimation = function(i){
  if(i<=this.steps.length){
	  this.createBalls(this.steps[i-1]);
    return true;
  }else{
    return false;
  }
}
  
BouncingBalls.prototype.endAnimation = function(){
  this.container.innerHTML = "";
}
    
// Internal methods
BouncingBalls.prototype.createBalls = function(n){
  this.container.innerHTML = "";
  var _this = this;
  for(var i=0; i<n; i++){
   setTimeout(function(){
      var innerdiv = document.createElement("div");
      var outerdiv = document.createElement("div");
      var radius = Math.round(Math.random()*20 + 10);
      var outerStyle = "position:absolute;";
      outerStyle += "width:" + 2*radius + "px;";
      outerStyle += "height:" + _this.cheight + "px;";
      outerStyle += "right:" + (_this.cwidth - 2*radius) + "px;";
      outerStyle += "top:0px;";
      outerStyle += "background-color:transparent;";
      outerStyle += "animation-duration:" + (Math.round(Math.random()*2) + 3) + "s;";
      outerStyle += "-webkit-animation-duration:" + (Math.round(Math.random()*2) + 3) + "s;";
      outerStyle += "-moz-animation-duration:" + (Math.round(Math.random()*2) + 3) + "s;";
      outerStyle += "-o-animation-duration:" + (Math.round(Math.random()*2) + 3) + "s;";
      outerdiv.setAttribute("style",outerStyle);
      outerdiv.className = "sliding";
      var innerStyle = "position:absolute;";
      innerStyle += "width:" + 2*radius + "px;";
      innerStyle += "height:" + 2*radius + "px;";
      innerStyle += "border-radius:" + radius + "px;";
      innerStyle += "left:0px;";
      innerStyle += "bottom:" + (_this.cheight - 2*radius - Math.round((Math.random()*300)))+"px;";
      innerStyle += "background-color:" + "rgb("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+");";
      innerStyle += "animation-duration:" + (Math.round(Math.random()*2) + 1) + "s;";
      innerStyle += "-webkit-animation-duration:" + (Math.round(Math.random()*2) + 1) + "s;";
      innerStyle += "-moz-animation-duration:" + (Math.round(Math.random()*2) + 1) + "s;";
      innerStyle += "-o-animation-duration:" + (Math.round(Math.random()*2) + 1) + "s;";
      innerdiv.setAttribute("style",innerStyle);
      innerdiv.className = "bouncing";
      outerdiv.appendChild(innerdiv);
      _this.container.appendChild(outerdiv);    
   }
   ,Math.random()*1000);
  } 
}

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
