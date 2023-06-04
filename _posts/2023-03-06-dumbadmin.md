---
title: "[DanteCTF 2023] - Dumb Admin"
date: 2023-06-03
author: me
categories: [writeups]
tags: ["Web", "DanteCTF", "SQLi", "FileUpload"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*The Admin coded his dashboard by himself. He's sure to be a pro coder and he's so satisfied about it. Can you make him rethink that?*

`https://dumbadmin.challs.dantectf.it`


<br>


_____________________________________________________


<br>

By reaching the URL we arrive on a basic login form :


![0](/images/dantectf/dumbadmin/1.png)

In order to see how the application works I tried `test:test` credentials:

![1](/images/dantectf/dumbadmin/2.png)

And here is the anwser:

![2](/images/dantectf/dumbadmin/3.png)

`Invalid password format`. Here, we understand we have to give a password in a specific encoding. My first idea was to try giving a base64-encoded password.

![2](/images/dantectf/dumbadmin/4.png)

So let's try `test:dGVzdA==`:

![2](/images/dantectf/dumbadmin/5.png)

Nice ! So we are on the right way, we must encode our passwords in `base64`. 

Now, we can basically try an SQL injection, in order to bypass the authentication step:

![2](/images/dantectf/dumbadmin/6.png)

It works ! So, now we have gaining access to the Admin panel, and it looks like we can upload files:

![2](/images/dantectf/dumbadmin/7.png)

As there is the "Max 2KB" constraint, I decided to generate a very small image in python, with the `PIL` library :

```python
from PIL import Image

image = Image.new("1", (1, 1))

image.putpixel((0, 0), 0)

image.save("pic.jpeg")
```

Then I uploaded it:

![2](/images/dantectf/dumbadmin/8.png)

And by clicking on the link, we arrive on this page showing us the rendering :

![2](/images/dantectf/dumbadmin/9.png)

At this point, we understand we probably have to exploit a FileUpload vulnerability. In this case, I started BurpSuite and tried to upload a `.php` file :

![2](/images/dantectf/dumbadmin/10.png)

Not surprisingly, we notice that `.php` files arn't allowed.

By looking at <a href="https://book.hacktricks.xyz/pentesting-web/file-upload"> Hacktricks - FileUpload</a> section, we can see an interesting part to bypass file extension checks :

![2](/images/dantectf/dumbadmin/18.png)

So let's try to add a valid file extension, as explained : 

![2](/images/dantectf/dumbadmin/11.png)

It works, but unfortunately, it seems that the program checks the content of the file. 

After a lot of attempts, I noticed something interesting in the request's response : 

![2](/images/dantectf/dumbadmin/12.png)

Now, we understand our file is checked by the `exif_imagetype()` function.

![2](/images/dantectf/dumbadmin/13.png)

Then, I searched some exploits or techniques to bypass this function, and I found an interesting Githug repository called <a href="https://github.com/AlessandraZullo/shellImage">ShellImage </a> :

![2](/images/dantectf/dumbadmin/14.png)

So let's try this, and execute a `phpinfo` on the server :

```python
fh = open('exploit.jpeg.php', 'w')
fh.write('\xFF\xD8\xFF\xE0' + '<? phpinfo(); ?>')
fh.close()
```

Uploading the php file :

![2](/images/dantectf/dumbadmin/15.png)

It looks like it worked !

![2](/images/dantectf/dumbadmin/16.png)

And now, by going on our php file, we should see our `phpinfo` content :

![2](/images/dantectf/dumbadmin/17.png)

Perfect, we are now able to RCE, so let's get the flag : 

```python
fh = open('exploit2.jpeg.php', 'w')
fh.write('\xFF\xD8\xFF\xE0' + '<? system("cat /flag.txt"); ?>')
fh.close()
```

![2](/images/dantectf/dumbadmin/flag.png)

> 🚩 `DANTE {YOu_Kn0w_how_t0_bypass_things_in_PhP9Abd7BdCFF}`