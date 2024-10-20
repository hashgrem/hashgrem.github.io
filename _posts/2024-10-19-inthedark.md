---
title: "[DeadFace CTF] - Something In The Dark"
date: 2024-10-19
author: me
categories: [writeups]
tags: ["Steganography", "DeadFace CTF"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*DEADFACE extracted a sensitive photo from Lytton Labs. As far as we can tell, it’s just a normal photo of a neighborhood at night, but the man who took the photo insists he saw something else. Here is the man’s original tweet. He later added the following image below.*

*Submit the flag as* `flag{flag_text_here}`

<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#given-file">Given file</a>
- <a href="#aperi'solve">Aperi'Solve</a>

<br>

_____________________________________________________


<br>

## Given File

We are given the following `.png` file:

![2](/images/deadface/steg/didyouseeit.png)

My first idea was to upload the picture in Aperi'Solve in order to see every data.

## Aperi'Solve

After uploading we quickly notice new data appearing after color manipulation:

![2](/images/deadface/steg/aperisolve.png)

We notice the flag:

![2](/images/deadface/steg/aperisolve2.png)

> 🚩 `flag{ar3_we_410N3??}`

Thanks for reading !