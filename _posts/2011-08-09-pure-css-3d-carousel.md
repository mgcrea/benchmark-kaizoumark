---
layout: post
title: Pure CSS 3D Carousel
categories:
- Web Development
tags: Animation Carousel CSS3 3D
published: true
---
CSS 3D transformations are a wonderful tool to add very impressive animation effects to your web pages without requiring a massive amount of javascript and/or WebGL code.

<!--more-->

More, unlike 2D canvas for instance, if a browser supports CSS 3D Transforms, it is almost certain that it is backed by hardware-acceleration, and thus the effects should not suffer from sluggishness in the animation.

This post demonstrates how a pure 3D CSS carousel can be implemented.

## Design principles

The carousel is constructed dynamically based on the number of cells and their size.

The cells are children elements of a single containing block element.  

Relatively to the parent element, each cell element is positioned in the 3D space on an horizontal plane using its [polar coordinates](http://en.wikipedia.org/wiki/Polar_coordinate_system) (ie angle and distance from the coordinates origin).

The <code>N</code> cells are positioned evenly on the carousel using a rotation based on their index <code>n</code>

<math>
  <mrow>
    <mi>alpha</mi>
    <mo>=</mo>
    <mi>n</mi>
    <mo>x</mo>
    <mfrac>
     <mrow>
      <mn>2</mn>
      <mo>&#960;</mo>
     </mrow>
     <mi>N</mi>
   </mfrac>
</mrow>
</math>

they are also positioned far enough from the center of the carousel circle so that they don't overlap:

<math>
  <mrow>
    <mi>distance</mi>
    <mo>=</mo>
 <mfrac>
  <mi>width</mi>
  <mrow>
   <mn>2</mn>
   <mo>&#8290;</mo>
   <mrow>
    <mi>tan</mi>
    <mo>&#8289;</mo>
    <mo>(</mo>
    <mfrac>
     <mi>&#960;</mi>
     <mi>N</mi>
    </mfrac>
    <mo>)</mo>
   </mrow>
  </mrow>
 </mfrac>
</mrow>
</math>

Only the parent element is rotated to achieve the carousel effect.

To allow the carousel to be specialized for any type of content, the cells are created empty, and it is up to the web page code to populate them using dedicated callbacks specified during initialization.

## Implementation details

The code for the carousel looks like this:

    /*
      The carousel constructor
      
      Parameters:
      - container : the containing DOM node
      - nbcell    : the number of cells in the carousel
      - cwidth    : the width of each cell
      - cheight   : the height of each cell
      - onadded   : a callback function when a cell is added to the carousel
      - onfocus   : a callback function when the front cell is focussed
      - onblur    : a callback function when the front cell is blurred  
      - onselect  : a callback function when the front cell is selected 
    */
    function Carousel(container,nbcell,cwidth,cheight,onadded,onfocus,onblur,onselect){
      this.carousel = document.createElement("div");
      this.carousel.className = "carousel";
      this.nbcell = nbcell;
      this.cwidth = cwidth;
      this.cheight = cheight;
      this.onadded = onadded;
      this.onfocus = onfocus;
      this.onblur = onblur;
      this.onselect = onselect;
      this.cells = new Array();
      this.theta = 0;
      this.frontIndex = 0;
      this.radius = Math.ceil(this.cwidth/2/Math.tan(Math.PI/this.nbcell));
      this.id = this.getContainerId(container);
      var _this = this;
      var carouselRule = '#' + this.id + ' .carousel {';
      carouselRule +='position:relative;';
      carouselRule +='transform-style: preserve-3d;';
      carouselRule +='transition: transform 0.5s;';
      carouselRule +='width:100%;';
      carouselRule +='min-width:'+this.cwidth*2+'px;';
      carouselRule +='min-height:'+this.cheight*1.2+'px;';
      carouselRule +='transform: translateZ(-'+this.radius+'px)';
      carouselRule +='}';
      this.insertRule(carouselRule);
      var cellRule = '#' + this.id + ' .carousel .cell {';
      cellRule +='position:absolute;';
      cellRule +='left: 0px;';
      cellRule +='right: 0px;';
      cellRule +='top: 0px;';
      cellRule +='bottom: 0px;';      
      cellRule +='margin: auto;';
      cellRule +='width:'+this.cwidth+'px;';
      cellRule +='height:'+this.cheight+'px;';
      cellRule +='opacity:0.8;';
      cellRule +='transition-property: all;';
      cellRule +='transition-duration: 0.5s;';
      cellRule +='}'; 
      this.insertRule(cellRule);
      var containerRule = '#' + this.id + ' {';
      containerRule += "perspective: 1100px;";
      containerRule += "perspective-origin: 50% 50%;";
      containerRule += "}";
      this.insertRule(containerRule);
      for(var i=0; i<this.nbcell; i++) this.addCell(i);
      container.appendChild(this.carousel);
      this.focus();
    }

    Carousel.prototype.getContainerId = function(container) {
      if( ! container.id ) {
        var id = 0;
        while (document.getElementById('carousel'+ id)){};
        container.id = 'carousel'+ id;
      }
      return container.id;
    }

    Carousel.prototype.insertRule = function(rule) {
      if( document.styleSheets.length == 0 ) {
        var style = document.createElement('style');
        style.type = 'text/css';
       	document.getElementsByTagName('head')[0].appendChild(style);
      }
      var styleSheet = document.styleSheets[document.styleSheets.length-1];
      // If prefixfree is available, use it
      rule = window.PrefixFree ? PrefixFree.prefixCSS(rule,true):rule;
      // Insert the rule
      styleSheet.insertRule(rule,styleSheet.cssRules.length);  
    }

    Carousel.prototype.focus = function(){
      var frontCell = this.cells[this.frontIndex];
      frontCell.focus();
      if(this.onfocus) this.onfocus(frontCell,this.frontIndex);
    }

    Carousel.prototype.blur = function(){
      var frontCell = this.cells[this.frontIndex];
      frontCell.blur();
      if(this.onblur) this.onblur(frontCell,this.frontIndex);
    }

    Carousel.prototype.select = function(index){
      selIndex = index ? index : this.frontIndex;
      if(this.onselect) this.onselect(this.cells[selIndex],selIndex);
    }

    Carousel.prototype.addCell = function(index){
      var nthcellRule = '.cell:nth-child('+(index+1)+') {';
      nthcellRule +='transform: rotateY('+index*360/this.nbcell+'deg)';
      nthcellRule +='translateZ('+this.radius+'px);';
      nthcellRule +='}';
      this.insertRule(nthcellRule);
      nthcellRule = '.cell:nth-child('+(index+1)+'):focus {';
      // Prevent outline to be displayed when the element is focussed
      nthcellRule +='outline: 0;';
      nthcellRule +='opacity: 1.0 !important;';
      nthcellRule +='transform: rotateY('+index*360/this.nbcell+'deg)';
      nthcellRule +='translateZ('+(this.radius*1.2)+'px);';
      nthcellRule +='transition-delay: 0.5s';
      nthcellRule +='}';
      this.insertRule(nthcellRule);
      var cell=document.createElement("div");
      cell.className = "cell";
      // Make div focussable
      cell.setAttribute("tabindex","-1");
      this.cells.push(cell);
      this.carousel.appendChild(cell);
      if(this.onadded) this.onadded(cell,index);
    }

    Carousel.DIRECTION = {
    LEFT:-1,
    RIGHT:1
    };

    /*
      Rotate the carousel to the left or right
      
      Parameters:
      - direction: Carousel.DIRECTION.LEFT or Carousel.DIRECTION.RIGHT  
      
    */
    Carousel.prototype.rotate = function(direction) {
      this.blur();
      this.frontIndex = (this.frontIndex - direction + this.nbcell)%this.nbcell;
      this.theta = (this.theta + direction*( 360 / this.nbcell ));
      var style = 'transform: translateZ(-'+this.radius+'px) rotateY(' + this.theta + 'deg)';
      // If prefixfree is available, use it
      style = window.PrefixFree ? PrefixFree.prefixCSS(style,true):style;
      this.carousel.setAttribute('style',style);
      this.focus();
    }



## Live Demonstrations

The following demos only work on recent Chrome, Safari or Firefox.

Here is a first example using images.

<div class='picture'>
<a href="/demos/3d-carousel-demo"><img src="/images/3d-carousel-images.png"></a>
<div class='legend'>Click on the image to see the live version</div>
</div>

And another example using this time video elements.

<div class='picture'>
<a href="/demos/3d-video-carousel-demo/"><img src="/images/3d-carousel-videos.png"></a>
<div class='legend'>Click on the image to see the live version</div>
</div>

