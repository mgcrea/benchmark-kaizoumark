---
layout: post
title: 'Different ways of arranging a list of items horizontally'
categories:
- Web Development
tags:
- CSS
status: publish
type: post
published: false
---
This is a very common use case in Web design to arrange a list of items horizontally, be it to render a header, a menu, a navigation bar or a footer.
CSS provides several options to display items horizontally, each with its own specificities.
I will describe some of them below, explaining how they can support the two following use-cases:
- a centered list of items,
- an evenly distributed list of items.
<!--more-->

h2. Common styling

h3. Base structure

I assume that the elements are organized into an ordered (ol) or unordered (ul) list, as it is what makes the most sense in terms of accessibility.

<pre class='prettyprint'>
<p>A centered list of items</p>
<ul>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>A list of items evenly distributed</p>
<ul>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</pre>

h3. Getting rid of user-agent defaults

All browsers provide a default styling for List elements, so our first task would be to override a few style properties:

<pre class='prettyprint'>
ul.container {
    list-style: none;
    padding-start: 0px;
    margin-before: 0px;
    margin-after: 0px;
}
</pre>

Note: a more generic approach to the issue of dealing with browser default stylesheets is described in <a href='http://meyerweb.com/eric/tools/css/reset/'>this post</a> by <a href='http://meyerweb.com/'>Eric Meyer</a>.

h3. A better look

Then, we apply a few cosmetic styling rules:

<pre class='prettyprint'>
ul.container {
    background-color: lightgrey;
}
ul.container > li {
    background: -webkit-linear-gradient(left , grey, transparent 1px);
    background: linear-gradient(to left , grey, transparent 1px);
    text-align: center;
}
</pre>

Note: I have outlined the left border of each item in grey, but instead of using a real CSS border, I have used a fake CSS gradient of 1px so that the border doesn't increase the width of the item. 

h3. Shrink to fit

Our first use case requires that our list of items be centered in the page.

Setting the CSS text-align property to center on the main containing block will center all children elements whose width can be computed.

However, the list container being a block element, it will by default occupy the full width of the page.
  
The solution is to force the browser to evaluate the width of the list container by applying the 'shrink-to-fit' algorithm described in the <a href='http://www.w3.org/TR/CSS21/visudet.html#Computing_widths_and_margins'>CSS 2.1 specification</a>. 

The 'shrink-to-fit' algorithm applies to:
- floated elements,
- absolute positioned elements,
- inside-block elements.

But since we want to center the element, we obviously don't want to use float or absolute positioning.

The basic styling for our first use case is therefore:

<pre class='prettyprint'>
ul.centered {
    display: inline-block;
}
</pre> 
 

This behavior can be achieved by assigning the CSS text-align property to center  

There are two ways of achieving this: you can either is is typically achieved in CSS by specifying a margin of 0 auto on  

Below is the rendering that we will use as a base for our transformations:

<notextile>
<style>
div.figure {
    width: 40em;
    border: 1px solid blue;
    margin: 0 auto;
    text-align: center;
}
ul.container {
    list-style: none;
    -webkit-padding-start: 0px;
    -webkit-margin-before: 0px;
    -webkit-margin-after: 0px;
    background-color: lightgrey;
}
ul.container > li {
    background: -webkit-linear-gradient(left , grey, transparent 1px);
    background: linear-gradient(to left , grey, transparent 1px);
    text-align: center;
}
ul.centered {
    display: inline-block;
}
ul.centered > li {
    padding-left: 1em;
    padding-right: 1em;
}
ul.even > li {
    width: 20%;
}
</style>
<div class='figure'>
<p>A centered list of items</p>
<ul class='container centered'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>A list of items evenly distributed</p>
<ul class='container even'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
</notextile>

As you can see, the items are arranged vertically, and extend horizontally to fill the full width of their parent.

h2. Option 1: Use the CSS float property

The first option is to use the CSS float property, so that the items stack horizontally starting from the side of their container.

<pre class='prettyprint'>
ul.float > li {
    float: left;
}
</pre>
<notextile>
<style>
ul.float > li {
    float: left;
}
</style>
</notextile>

Having the list items float to the left is however not enough to achieve a correct rendering, as you can see below:

<notextile>
<div class='figure'>
<ul class='container float'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>Some text</p>
</div>
</notextile>

Let's solve the issues one by one.

h3. Issue 1: the items shrink to wrap exactly around their text content

CSS 2.1 < a href='http://www.w3.org/TR/CSS21/visudet.html#float-width'>specifies</a> that a floated element has by default no left or right margins,
and that its width shall be calculated using a 'shrink-to-fit' algorithm.

To solve this, we can either specify explicitly the items margin, or set their width.

Both options are valid, but as we will see below, setting explicitly the width of each item is more or less required to solve wrapping issues, so we actually don't have much choice.

<pre class='prettyprint'>
ul.float > li {
    width: 6em;
}
</pre>

<notextile>
<style>
ul.fixed > li {
    width: 6em;
}
</style>
<div class='figure'>
<ul class='container float fixed'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>Some text</p>
</div>
</notextile>

h3. Issue 2: the element following the list wraps around it to the right.

The legacy fix is to use the CSS clear property on a dummy element following the list.

<pre class='prettyprint'>
<div style="clear: both"></div>
</pre>

or, using only CSS, and taking avantage of the after selector:

<pre class='prettyprint'>
ul.container:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
</pre>

<notextile>
<div class='figure'>
<ul class='container float fixed'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<div style="clear: both"></div> 
<p>Some Text</p>
</div>
</notextile>

A better solution exist however, as we will see below solving the next issue. 

h3. Issue 3: the list container doesn't expand vertically to include its children

As a matter of fact, since its children elements have been removed from the document flow, the list container has no height unless you specify one explicitly.
See below the boundaries of the list container outlined in red:  

<notextile>
<div class='figure'>
<ul class='container float fixed' style='border: 1px solid red'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<div style="clear: both"></div> 
<p>Some Text</p>
</div>
</notextile>

Although this may not be an issue under some specific circumstances, in most cases it does matter:
- you may need (as in our example) to apply a common style to the container, like a border or a background,
- you may want to associate behaviour to the list container to handle mouse hovering and clicks.

In those cases, a solution is to use the overflow property to force the container to expand vertically:

<pre class='prettyprint'>
ul.float {
    overflow: auto;
}
</pre>

<notextile>
<style>
ul.fit {
    overflow: auto;
}
</style>

<div class='figure'>
<ul class='container float fixed fit'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>Some Text</p>
</div>
</notextile>

As a bonus, this also prevents the elements following the list to wrap around it, so we don't need to use the CSS clear property. Two birds killed with one stone !

h3. Issue 4: the list container does now wrap horizontally around its children

This is an issue if the width of the container exceeds the aggregated width of its children, as a gap will appear on the right, but it is worse if there is not enough space for all items to fit, as they will expand on several lines.

<notextile>
<div class='figure'>
<ul class='container float fixed fit' style="width: 300px;margin: 0 auto">
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>Some Text</p>
</div>
</notextile>

The only solution to have the container wrap exactly around its children is to specify its width explicitly.
However this means you need to know in advance:
- the number of items,
- the width of each item.

h3. Summary of the float technique

As a rule of thumb, use this method only if you have a fixed number of items, and if you can control the width of each item. 

<pre class='prettyprint'>
ul.float {
    width: 30em;
    overflow: auto;
}
ul.float > li {
    width: 6em;
    float: left;
}
</pre>

<notextile>
<div class='figure'>
<p>A centered list of items</p>
<ul class='container float fit centered'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>A list of items evenly distributed</p>
<ul class='container float fixed fit even'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
</notextile>


h2. Option 2: Use the CSS display property

Using the CSS display property, we can specify that the block-level list items behave like inline-level elements. 

<pre class='prettyprint'>
<style>
ul.inline > li {
    display: inline;
}
</style>
</pre>

As you can see below, the items do now arrange themselves horizontally, but it is not quite yet the rendering we were trying to achieve. 

<notextile>
<style>
ul.inline > li {
    display: inline;
}
</style>
<div class='figure'>
<p>A centered list of items</p>
<ul class='container inline centered'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>A list of items evenly distributed</p>
<ul class='container inline even'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
</notextile>

Again, let's solve the corresponding issues one by one.

h3. Issue 1: the items shrink to wrap around their text content

CSS 2.1 <a href='http://www.w3.org/TR/CSS21/visudet.html#inline-width'>specifies</a> that inline elements have by default no margin left and right, and that their width cannot be specified explicitly.

There are two ways to solve this:
- if you don't care about the actual size of the items, then you can just specify explicitly the left and right margins

<pre class='prettyprint'>
ul.inline > li {
    display: inline;
    margin-left: 1em;
    margin-right: 1em;
}
</pre>

- if you really care about the width, then you can set the display property to inline-block instead of inline. It forces the items to behave as inline-level elements, yet retaining the ability to control their width.

<pre class='prettyprint'>
ul.inline > li {
    display: inline-block;
    width: 6em;
}
</pre>

Let's put things straight: most of the time, inline-block is the way to go.  
As a matter of fact, the only advantage of using inline versus inline-block is that an inline element can span on multiple lines whereas an inline-block can't.

Here is the updated rendering:

<notextile>
<style>
ul.inline-block > li {
    display: inline-block;
    width: 6em;
}
</style>
<div class='figure'>
<ul class='container inline-block'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
<p>Some Text</p>
</div>
</notextile>


h3. Issue 2: there is an extra spacing between items

This gap is neither margin nor padding: it does actually correspond to the space that the browser inserts between words and letters in text.

You can somehow control it using the CSS letter-spacing and browser-spacing properties, but it is somekind of hackish in my opinion.


display: table + display: table-cell



