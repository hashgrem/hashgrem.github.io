---
title: "[FCSC 2023] - Dystylosaurus"
date: 2023-04-26
author: me
categories: [writeups]
tags: ["Hardware", "FCSC"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*Votre tante paléontologue est portée disparue depuis plusieurs jours. Heureusement, le maire de son village vous a contacté en disant qu'il vient de trouver la tablette à encre électronique de votre tante dans un champ.*

*Vous venez de réceptionner la tablette, néanmoins elle ne s'allume plus. Après une courte observation, vous remarquez cinqs petits connecteurs sur le côté de la tablette. Vous y connectez un analyseur logique honteusement volé à un autre de vos proches.*

*Saurez-vous retrouver un indice secret à partir de cette acquisition ?*

*Note : La capture logique a été réalisée avec le logiciel Saleae Logic 2.*

<br>

_____________________________________________________

## Given files

We are given a `.sal` file. The `file` command allow us to learn more about it:

![0](/images/dystylosaurus/step0.png)

Now, let's open our logical capture with <a href="https://www.saleae.com/fr/downloads/" target="_blank">Salae Logic</a>:


![0](/images/dystylosaurus/step1.png)

We can notice many signals in channel 3:


![0](/images/dystylosaurus/step2.png)

In order to understand the data, we can try to read signals transmitted via the asynchronous serial transmission line.

>In data transmission, the asynchronous communication uses transmission one byte at a time. There is a transmission line (Tx) and a reception line (Rx). To differentiate the bits, they are enclosed by a start bit and a stop bit, as following:
{: .prompt-tip }


![0](/images/dystylosaurus/step3.5.png)

So let's try to decode transmitted data with the Async Serial Analyzer:

![0](/images/dystylosaurus/step3.png)

Now we can notice many hexa characters above signals:

![0](/images/dystylosaurus/step4.png)

In the Analyzer settings, we can switch from Data table to Terminal view:

![0](/images/dystylosaurus/step5.png)

And here we have the full decoded data containing the flag !

![0](/images/dystylosaurus/step6.png)

> 🚩`FCSC{b1dee4eeadf6c4e60aeb142b0b486344e64b12b40d1046de95c89ba5e23a9925}`




