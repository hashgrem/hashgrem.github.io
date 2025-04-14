---
title: "[Pointer Overflow] - The Way Out is Through"
date: 2025-01-02
author: me
categories: [writeups]
tags: ["Web", "Javascript", "Pointer Overflow"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*The first Web challenge of the contest and I am so excited to reveal this one! In this challenge you'll run through a simulated web-based cybersecurity training course a la the DoD Cyber Exchange Awareness Challenge. There's just one problem... The cybersecurity training is... Vulnerable??! Oh, the irony! Can YOU handle the HACK OF THE CENTURY??? Head here to find out!*

[http://nvstgt.com/TTiOT/index.html](http://nvstgt.com/TTiOT/index.html)

<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#endpoint">Endpoint</a>
- <a href="#source-code">Source Code</a>
- <a href="#flag">Flag</a>

<br>

_____________________________________________________


<br>

## Endpoint

By reaching the endpoint, we arrive on this main page:

![2](/images/pointer_overflow/the%20way/main_page.png)

I first thought that I had entered the wrong URL, but looking at the network inspector, we noticed that it is a fake error page. Indeed, the HTTP code is 200.

![2](/images/pointer_overflow/the%20way/main_pag2.png)

## Source Code

Since there is no user input, let's look at the source code.

![2](/images/pointer_overflow/the%20way/source_code.png)

We notice the following Javascript code :

```javascript
let part_1 = [112, 111, 99, 116].map(x => String.fromCharCode(x)).join('');
let part_2 = atob("Znt1d3NwXw==");
let part_3 = "document.cookie";
let part_4 = "XzdydTdoXw==";
let part_5_hex = [0x31, 0x35, 0x5f, 0x30, 0x75, 0x37, 0x5f, 0x37, 0x68, 0x33, 0x72, 0x33, 0x7d];

console.log("The Tooth is Over There.");
document.cookie = "\u0037\u0068\u0033";
```

We understand here that we will have to build the flag with the different parts.

## Flag

Pretty simple. Here is my JS script:

```javascript
let part_1 = [112, 111, 99, 116].map(x => String.fromCharCode(x)).join('');
let part_2 = atob("Znt1d3NwXw==");
let part_3 = "\u0037\u0068\u0033";
let part_4 =  atob("XzdydTdoXw==");
let part_5 = [0x31, 0x35, 0x5f, 0x30, 0x75, 0x37, 0x5f, 0x37, 0x68, 0x33, 0x72, 0x33, 0x7d].map(e => String.fromCharCode(e)).join('');

console.log('Flag: '+part_1+part_2+part_3+part_4+part_5)
```

![2](/images/pointer_overflow/the%20way/flag.png)

> 🚩 `poctf{uwsp_7h3_7ru7h_15_0u7_7h3r3}`

Thanks for reading !