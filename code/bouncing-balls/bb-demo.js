// bb-demo.js
// Copyright David Corvoysier 2012
// http://www.kaizou.org

var bouncingBalls;

window.addEventListener("load",init,false);

function init(){
  bouncingBalls = new BouncingBalls(document.getElementById("container"));
  bouncingBalls.startAnimation(2);
}
