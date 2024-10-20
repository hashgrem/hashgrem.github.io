---
title: "[DeadFace CTF] - Under Pressure"
date: 2024-10-20
author: me
categories: [writeups]
tags: ["Exploitation", "PrivEsc","Boot2Root", "DeadFace CTF"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*Finally, we’ve almost captured all of the secrets on this machine! There is a flag that belongs to the root user. Perhaps there is a way to escalate privileges from lilith to root that will allow you to read the flag.*

*Submit the flag as* `flag{flag_text_here}`


<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#remote-host">Remote Host</a>
- <a href="#recon">Recon</a>
- <a href="#analysis">Analysis</a>
- <a href="#privilege-escalation">Privilege Escalation</a>

<br>

_____________________________________________________


<br>

## Remote Host

Connection Info:
- Host: deephax@deephax.deadface.io
- Username: deephax
- Password: D34df4c32024$

## Recon

The machine is made up of 2 users: `deephax` & `lilith`:

![2](/images/deadface/hostbuster/step2.png)

User `deephax` is not authorized to execute commands with `sudo`:

![2](/images/deadface/hostbuster/step1.png)

At first sight, user `deephax` is not allowed to run useful binaries or scripts:

![2](/images/deadface/hostbuster/step3.png)

However, we get something interesting here, looking for files that have the SUID bit enabled:

![2](/images/deadface/hostbuster/step4.png)

Let's try to get more information about that `readlog` binary.

## Analysis

By running the file, we do not obtain any interesting information, except that the binary takes a file as a parameter and reads the content.

![2](/images/deadface/hostbuster/step5.png)

Firstly I decided to look at the strings, to see if I was on the right way, and to make sure that this binary was useful.

![2](/images/deadface/hostbuster/step6.png)

Very interesting, looks like we could execute commands as `lilith` user.

Here we don't have enough information to exploit this script. So I looked for files or folders associated with this binary (like a conf file for example).

![2](/images/deadface/hostbuster/step7.png)

Perfect ! Looks like a man file exists for this binary. Let's look at what's in it.

![2](/images/deadface/hostbuster/step8.png)

Here we find the interesting part which allows us to execute commands as `lilith`.

![2](/images/deadface/hostbuster/step9.png)

We can therefore execute commands as `lilith`. At this point, my first idea was to see if lilith could run commands as `root` with sudo. So let's see: 

![2](/images/deadface/hostbuster/step10.png)

Looks like `lilith` is allowed to execute `/usr/bin/zip` as root. Now, we can try to exploit this.

## Privilege Escalation

I found this article showing how to execute system command using zip: [Linux for Pentester : ZIP Privilege Escalation](https://www.hackingarticles.in/linux-for-pentester-zip-privilege-escalation/).

And we found this interesting part:

![2](/images/deadface/hostbuster/step11.png)

Now we just have to exploit our vulnerability and get a shell as root :

![2](/images/deadface/hostbuster/root.png)


> 🚩 `flag{hostbusters6_41a4e1304f74df0c}`

Was a very interesting chall, thanks for reading !