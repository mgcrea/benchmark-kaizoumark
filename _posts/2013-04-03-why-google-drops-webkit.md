---
layout: post
title: 'Why Google Drops WebKit'
categories:
- Web Development
tags:
- WebKit
- Blink
- Google
type: post
published: false
---
Google announced yesterday in a [short post](http://blog.chromium.org/2013/04/blink-rendering-engine-for-chromium.html) on the Chromium Blog that they were dropping WebKit for Blink, a new rendering engine.
 
I was at first taken aback by the announcement, but after a moment of recollection, I realized that I should have seen it coming ...  
<!--more-->

## Drop the burden  

I have been working with WebKit for quite a while now, mainly integrating the smaller ports (Qt, GTK, EFL) on embedded targets for my employer. 

One of my main concern has always been to make sure that the port I was basing a product on was not a dead-end, ie that there was a big enough community backing it to make sure that the continuous stream of features got integrated in a timely fashion.

After Nokia dropped Qt I started to monitor closely who was doing what on WebKit to check what impact it would have on QtWebKit.

I started in particular to extract statistics from the commit logs, and soon realized that Google was by far the first contributor to WebKit.

.... 


## Differentiate form the competitors  