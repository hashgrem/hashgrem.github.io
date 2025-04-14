---
title: "[Pointer Overflow] - Known Unknowns"
date: 2025-01-02
author: me
categories: [writeups]
tags: ["Forensic", "Steganography", "Audacity", "Pointer Overflow"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*So, I was laying in an open field with my super sensitive directional mic, trying to listen to stars like I do every Saturday night. You know, normal stuff. It was going fine and I was jamming out to the sounds of Saturn when I hear this sound coming through. I'm guessing it's the sound of swamp gas reflecting off Jupiter.*

<i class="fas fa-paperclip"></i> [DF200-2.wav](/assets/attachments/DF200-2.wav)


<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#given-file">Given file</a>
- <a href="#audacity">Audacity</a>
- <a href="#flag">Flag</a>

<br>

_____________________________________________________


<br>

## Given file

We are given a `.wav` file. The `file` command allow us to learn more about it:

![0](/images/pointer_overflow/unknown/file.png)

So let's open this file with a digital sound recording software like [Audacity](https://www.audacityteam.org/)

## Audacity

![0](/images/pointer_overflow/unknown/audacity1.png)

The sound obtained is a high-pitched sound, which does not contain any words or elements allowing the flag to be found. A common element often used with WAV files in CTF is converting them to spectrogram view. 

> The spectrogram view sometimes reveals readable content because it displays audio frequencies on the vertical axis and time on the horizontal axis, with amplitudes represented by colors. This visual representation allows for detecting patterns or hidden messages in the audio frequencies, such as visually encoded text or other forms of data that are not directly audible in the sound.
{: .prompt-tip }

So let's switch to spectrogram view :

![0](/images/pointer_overflow/unknown/flag1.png)

Here we obtain a text which seems to represent the last part of the flag. From there, I tried several different views, but couldn't find anything more. I ended up getting something interesting by changing the sample rate.

## Flag

The sampling rate determines how many times per second an audio sample is taken to represent the analog signal in digital form.

Here’s what it means:

- A lower rate (like 8000 Hz) captures fewer details per second, which can result in lower sound quality, but it may be used for voice (such as in telecommunications).
    
- A higher rate (like 44100 Hz or 88200 Hz) captures more details per second, offering better sound quality, but it requires more storage space and processing power.

By default, the sampling rate is set to `44100 Hz` :

![0](/images/pointer_overflow/unknown/flag2.png)

Switching to `16000 Hz` and we got the following :

![0](/images/pointer_overflow/unknown/flag3.png)

> 🚩 `poctf{uwsp_7h3_13f7_h4nd_0f_d4rkn355}`

Thanks for reading !


