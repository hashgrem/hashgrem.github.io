---
title: "[Pointer Overflow] - Giving Up The Game"
date: 2025-01-02
author: me
categories: [writeups]
tags: ["Web", "Javascript", "Pointer Overflow"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*I can't wait to reveal this one! I have spent the entire summer working up an awesome game called Space Adventure! It's a bullet storm arcade shooter with survival horror elements and looter shooter portions heavily inspired by classics like Qubort, Donkey King, and Street Flighter II. Except this game isn't like other games - the only way to win is to cheat! Good luck!*

[http://34.135.223.176:7845/](http://34.135.223.176:7845/)

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

![2](/images/pointer_overflow/game/main_page.png)

I initially thought that I had to wait for the loading bar to be complete, but it didn't change anything. So, we have no user input. I decided to turn to the source code.

## Source Code

Since there is no user input, let's look at the source code.

![2](/images/pointer_overflow/game/source_code.png)

We notice the following Javascript code :

```javascript
const tips = [
    "Tip: Collect all power-ups to upgrade your ship! 💥",
    "Tip: Watch out for asteroids in Sector 7! 🪨",
    "Tip: Shields down! Restore power to your defenses! ⚡",
    "Tip: New ship parts available at the space station! 🚀",
    "Tip: Find the hidden treasure on Planet Zog! 🌌"
];

let tipIndex = 0;
const tipElement = document.querySelector('.fake-tips');

setInterval(() => {
    tipIndex = (tipIndex + 1) % tips.length;
    tipElement.textContent = tips[tipIndex];
}, 7000); // Change tips every 7 seconds
    
fetch('/getSprites')
    .then(response => response.json())
    .then(data => {
        console.log("VGhhbmsgeW91IE1hcmlvISBCdXQgb3VyIHByaW5jZXNzIGlzIGluIGFub3RoZXIgY2FzdGxlIQ==");
    }
);       
```

As the comment shows, the `setInterval()` function changes the display of tips every 7 seconds. Then the `fetch('/getSprites')` makes an HTTP GET request to the URL /getSprites, then retrieves the response in JSON format. After that, it decodes and logs a base64-encoded message to the console, which translates to `Thank you Mario! But our princess is in another castle!`.

We notice that the variable `data` is not used, so I decided to go to the `/getSprites` endpoint to see the response returned by the API.

![2](/images/pointer_overflow/game/get_sprites.png)

We notice an other base64-encoded string.

## Flag

Let's decode it !

![2](/images/pointer_overflow/game/flag.png)

> 🚩 `poctf{uwsp_1_7H1nk_7H3r3r0_1_4m}`

Thanks for reading !