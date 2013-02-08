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
    
* Will be replaced by the ToC
{:toc}

This is a very common use case in Web design to arrange a list of items 
horizontally, be it to render a header, a menu, a navigation bar or a footer.
CSS provides several options to display items horizontally, each with its own specificities.
I will describe some of them below, explaining how they can support the two following use-cases:

- a centered list of items,
- an evenly distributed list of items.

<!--more-->

## Common styling

### Base structure

I assume that the elements are organized into an ordered (ol) or unordered
 (ul) list, as it is what makes the most sense in terms of accessibility.

    <ul>
        <li>Lorem</li>
        <li>ipsum</li>
        <li>dolor</li>
        <li>sit</li>
        <li>amet</li>
    </ul>


### Getting rid of user-agent defaults

All browsers provide a default styling for List elements, so our first
task would be to override a few style properties:

    ul.container {
        list-style: none;
        padding-start: 0px;
        margin-before: 0px;
        margin-after: 0px;
    }

Note: a more generic approach to the issue of dealing with browser
default stylesheets is described in 
<a href='http://meyerweb.com/eric/tools/css/reset/'>this post</a> by
<a href='http://meyerweb.com/'>Eric Meyer</a>.

### A better look

Then, we apply a few cosmetic styling rules:

    ul.container {
        background-color: lightgrey;
    }
    ul.container > li {
        background: -webkit-linear-gradient(left , grey, transparent 1px);
        background: linear-gradient(to left , grey, transparent 1px);
        text-align: center;
    }

Note: I have outlined the left border of each item in grey, but instead 
of using a real CSS border, I have used a fake CSS gradient of 1px so 
that the border doesn't increase the width of the item. 

### Shrink to fit

Our first use case requires that our list of items be centered in the page.

Setting the CSS text-align property to center on the main containing
block will center all children elements whose width can be computed.

However, the list container being a block element, it will by default
occupy the full width of the page.
  
The solution is to force the browser to evaluate the width of the list
container by applying the 'shrink-to-fit' algorithm described in the 
<a href='http://www.w3.org/TR/CSS21/visudet.html#Computing_widths_and_margins'>
    CSS 2.1 specification
</a>. 

The 'shrink-to-fit' algorithm applies to:

- floated elements,
- absolute positioned elements,
- inside-block elements.

But since we want to center the element, we obviously don't want to use 
float or absolute positioning.

We also need to add an element wrapping the list container, whose 
text-align property will be set to center.

The basic structure and styling for our use cases is now:

    .centered {
        text-align: center;
    }
    .centered > ul {
        display: inline-block;
    }
    
    <p>A centered list of items</p>
    <div class='centered'>
        <ul class='container'>
            <li>Lorem</li>
            <li>ipsum</li>
            <li>dolor</li>
            <li>sit</li>
            <li>amet</li>
        </ul>
    </div>
    <p>A list of items evenly distributed</p>
    <ul class='container'>
        <li>Lorem</li>
        <li>ipsum</li>
        <li>dolor</li>
        <li>sit</li>
        <li>amet</li>
    </ul>    
    
<style>
div.figure {
    width: 40em;
    border: 1px solid blue;
    margin: 0 auto;
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
.centered {
    text-align: center;
}
.centered > ul {
    display: inline-block;
}
</style>
<div class='figure'>
<p>A centered list of items</p>
<div class='centered'>
<ul class='container'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
<p>A list of items evenly distributed</p>
<ul class='container'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>

Now, let's apply more styling to arrange the items horizontally. 

## Option 1: Use the CSS float property

The first option is to use the CSS float property, so that the items 
stack horizontally starting from the side of their container.

However, as we saw before, the 
<a href='http://www.w3.org/TR/CSS21/visudet.html#Computing_widths_and_margins'>
    CSS 2.1 specification
</a>specifies that floated elements have their width calculated
using a 'shrink-to-fit' algorithm, meaning that we need to specify either
the horizontal margins or the width of the list items to avoid them to 
wrap too closely around their content.

    ul.float > li {
        float: left;
        padding-left: 1em;
        padding-right: 1em;
    }

<style>
ul.float > li {
    float: left;
    padding-left: 1em;
    padding-right: 1em;
}
</style>
<div class='figure'>
<p>A centered list of items</p>
<div class='centered'>
<ul class='container float'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
<p>A list of items evenly distributed</p>
<ul class='container float'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>

As you can see, the rendering is correct for the first use case, but
there are two issues with the second one:

- the list container seems to have disappeared,
- the element following the list wraps around it to the right.

Let's solve these two issues one by one.

### Force the list container to include its children

As a matter of fact, since its children elements have been removed from 
the document flow, the list container has no height unless you specify 
one explicitly.
See below the boundaries of the list container outlined in red:  

<div class='figure'>
<p>A centered list of items</p>
<div class='centered'>
<ul class='container float'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>
<p>A list of items evenly distributed</p>
<ul class='container float' style='border: 1px solid red'>
    <li>Lorem</li>
    <li>ipsum</li>
    <li>dolor</li>
    <li>sit</li>
    <li>amet</li>
</ul>
</div>

Although this may not be an issue under some specific circumstances, in 
most cases it does matter:
- you may need (as in our example) to apply a common style to the container, like a border or a background,
- you may want to associate behaviour to the list container to handle mouse hovering and clicks.

In those cases, a solution is to use the overflow property to force the container to expand vertically:

    ul.float {
        overflow: auto;
    }

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

As a bonus, this also prevents the elements following the list to wrap around it, so we don't need to use the CSS clear property. Two birds killed with one stone !

### Stop wrapping after the list 

The legacy fix is to use the CSS clear property on a dummy element following the list.

    <div style="clear: both"></div>

or, using only CSS, and taking avantage of the after selector:

    ul.container:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

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

A better solution exist however, as we will see below solving the next issue. 


### Issue 4: the list container does now wrap horizontally around its children

This is an issue if the width of the container exceeds the aggregated width of its children, as a gap will appear on the right, but it is worse if there is not enough space for all items to fit, as they will expand on several lines.

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

The only solution to have the container wrap exactly around its children is to specify its width explicitly.
However this means you need to know in advance:
- the number of items,
- the width of each item.

### Summary of the float technique

As a rule of thumb, use this method only if you have a fixed number of items, and if you can control the width of each item. 

    ul.float {
        width: 30em;
        overflow: auto;
    }
    ul.float > li {
        width: 6em;
        float: left;
    }

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

## Option 2: Use the CSS display property

Using the CSS display property, we can specify that the block-level list items behave like inline-level elements. 

    ul.inline > li {
        display: inline;
    }

As you can see below, the items do now arrange themselves horizontally, but it is not quite yet the rendering we were trying to achieve. 

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

Again, let's solve the corresponding issues one by one.

### Issue 1: the items shrink to wrap around their text content

CSS 2.1 <a href='http://www.w3.org/TR/CSS21/visudet.html#inline-width'>specifies</a> that inline elements have by default no margin left and right, and that their width cannot be specified explicitly.

There are two ways to solve this:
- if you don't care about the actual size of the items, then you can just specify explicitly the left and right margins

    ul.inline > li {
        display: inline;
        margin-left: 1em;
        margin-right: 1em;
    }

- if you really care about the width, then you can set the display property to inline-block instead of inline. It forces the items to behave as inline-level elements, yet retaining the ability to control their width.

    ul.inline > li {
        display: inline-block;
        width: 6em;
    }

Let's put things straight: most of the time, inline-block is the way to go.  
As a matter of fact, the only advantage of using inline versus inline-block is that an inline element can span on multiple lines whereas an inline-block can't.

Here is the updated rendering:

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

### Issue 2: there is an extra spacing between items

This gap is neither margin nor padding: it does actually correspond to the space that the browser inserts between words and letters in text.

You can somehow control it using the CSS letter-spacing and browser-spacing properties, but it is somekind of hackish in my opinion.


display: table + display: table-cell



