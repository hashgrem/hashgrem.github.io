---
title: "[DeadFace CTF] - Winning Factors"
date: 2024-10-19
author: me
categories: [writeups]
tags: ["MISC", "Python", "DeadFace CTF"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*As another test of your programming prowess, Turbo Tactical wants to see if you can write a script to solve mathematic equations being served by a remote server within 3 seconds.*

*Submit the flag as* `flag{flag_text_here}`

`147.182.245.126:33001`

<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#remote-host">Remote Host</a>
- <a href="#python-implementation">Python Implementation</a>

<br>

_____________________________________________________


<br>

## Remote Host

I first interacted with the remote server to see how it responded.

![2](/images/deadface/programming/netcat.png)

## Python Implementation

```python
import socket
import math

HOST = '147.182.245.126'
PORT = 33001

def get_factorial():
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        
        s.connect((HOST, PORT))

        data = s.recv(1024).decode('utf-8')
        print(">>> ", data)

        try:
            number_str = data.split()[-1].strip('.')
            number = int(number_str)
            print(f">>> Number recovered : {number}")

            factorial_result = math.factorial(number)
            print(f">>> {number}! = {factorial_result}")

            s.sendall(str(factorial_result).encode('utf-8')) #Sending answer
           
            data = s.recv(4096).decode('utf-8')
            print(">>>", data)
            
        except ValueError:
            print("Err")

if __name__ == "__main__":
    get_factorial()
```

Execution example:

```
python .\remote.py

>>>  Calculate the factorial of 430.
>>> Number recovered : 430
>>> 430! = 229465293678129211627173056099189068849352074140443334092009022868999642517619375728687468344160474470579121941700557753502724079082182688928472391488239220152550170633427480461841825091949094197944288801357794156601367090702457219551514694795041383014902497577944077036236488929813770982742476458637464014272144977108852373042517892799660381090776777345371874117528593766939404515022294585579229922895600270030646036593059021947665441750732474518228489659229220093971354782283841767339547932855683095663265044318658601301245012561049450544394753196869136356252131689854879575020367124223347906116180418225704758891534670308464690380805597256296500766587710946531721930047888093198443316682517823114800094779410555285227270126871474681260367085339120769396405168499546914951077942805409105929508281977033786695663759301972623962312464326983680000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
>>> Correct! Here is the flag: flag{1ntr0_f4ct0r14l_5t3p}
```

> 🚩 `flag{1ntr0_f4ct0r14l_5t3p}`

Thanks for reading !