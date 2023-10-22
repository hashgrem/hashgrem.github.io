---
title: "[Flag4All 2023] - Challengefox "
date: 2023-10-22
author: me
categories: [writeups]
tags: ["Web", "Flag4All", "BZHack", "PHP", "Type Juggling"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*The FOX society wish to hire PHP developers. So, they create a test with some code to audit. Analyze the code and find a way to print the flag* *to get the job!*


`https://fox.flag4all.sh`


<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#web-app">Web app</a>
    - <a href="#first-condition">First Condition</a>
    - <a href="#second-condition">Second Condition</a>
    - <a href="#third-condition">Third Condition</a>
    - <a href="#last-condition">Last Condition</a>
- <a href="#flag">Flag</a>
- <a href="#references">References</a>

<br>

_____________________________________________________


<br>

### Web App

By reaching the URL we arrive on an application showing us the source code as following:

```php

 <?php

goto rjJoj;
l5p8t:
$variable = str_replace("\143\x68\141\154\154\145\x6e\147\x65\146\x6f\x78", '', $variable);
goto MGxdQ;
lIReG:
function echec()
{
goto jCY0w;
Dm3Uc:
source();
goto pj4hI;
jCY0w:
echo "\x45\143\x68\x65\143\x2e\x20\74\x62\x72\40\57\76";
goto Dm3Uc;
pj4hI:
exit;
goto gPDe0;
gPDe0:
}
goto lbiZM;
bOncl:
if ($variable === "\143\x68\141\x6c\154\145\156\147\145\146\157\x78") {
echo "\x2d\x20\123\x69\40\143\145\x20\x74\x65\170\164\x65\x20\x61\x70\x70\x61\x72\x61\151\164\54\x20\x74\165\40\166\x61\154\x69\x64\x65\40\x6c\x61\x20\160\x72\x65\x6d\151\x65\162\x65\40\x65\x74\141\x70\x65\41\40\74\x62\x72\76";
if (isset($_GET["\143\150\x61\x6c\154\x65\x6e\147\x65\137\x66\157\x78"])) {
echo "\x2d\x20\104\145\165\x78\151\x65\155\x65\40\145\x74\141\160\145\x20\x76\141\154\x69\x64\145\41\x20\x3c\x62\162\x3e";
if (hash("\155\x64\x32", $_GET["\x76\141\x72\151\141\x62\x6c\x65\x32"]) == "\60") {
echo "\55\x20\124\x72\x6f\151\163\x69\x65\155\145\x20\145\164\141\160\x65\40\166\x61\x6c\151\x64\145\x21\x20\74\142\x72\x3e";
if (hash("\x73\x68\141\x31", $_GET["\166\x61\x72\x69\141\x62\154\145\x33"]) == $_GET["\x76\x61\x72\151\141\142\154\145\63"]) {
echo "\55\40\x4f\153\x61\171\x2c\40\x76\x6f\151\x63\151\40\154\145\x20\146\154\x61\147\40\x3a\x20" . $secretflag . "\74\142\x72\x3e";
}
}
}
}
goto nKESF;
HVY3V:
echo "\74\x70\x3e\x41\x6e\x61\x6c\171\x73\x65\x72\x20\154\x65\x20\143\157\x64\145\40\143\151\40\x64\x65\x73\x73\x6f\x75\163\x20\145\x74\x20\x74\x72\157\165\166\145\x72\x20\x6c\145\40\x6d\x6f\x79\x65\x6e\40\x64\40\x61\x66\x66\x69\x63\x68\x65\x72\x20\x6c\x65\x20\x66\154\141\x67\x2e\74\160\76";
goto g9hQi;
lbiZM:
$variable = $_GET["\166\141\x72\x69\141\142\154\145"];
goto l5p8t;
Oz2JG:
echo "\x3c\164\151\x74\154\145\76\x43\x68\x61\154\154\145\156\147\x65\40\x46\157\x78\x3c\x2f\164\151\x74\154\x65\76";
goto E0h5E;
MGxdQ:
$query = urldecode($_SERVER["\x51\x55\x45\122\x59\x5f\123\x54\122\x49\x4e\x47"]);
goto Z_G58;
MYfqC:
function source()
{
goto nUBkJ;
pqZ02:
highlight_string(file_get_contents(__FILE__));
goto P9KZ3;
nUBkJ:
echo "\x3c\x62\162\76\x3c\143\x6f\144\145\76";
goto pqZ02;
P9KZ3:
echo "\74\x2f\x63\157\144\145\76";
goto NTzIV;
NTzIV:
}
goto lIReG;
E0h5E:
echo "\74\x62\x3e\x43\150\x61\154\154\x65\x6e\x67\x65\40\106\157\x78\74\x2f\x62\76";
goto HVY3V;
Z_G58:
if (preg_match("\x2f\x20\174\137\x2f", $query)) {
echec();
}
goto bOncl;
g9hQi:
echo "\74\142\x72\76\x3c\110\x52\76\x3c\142\162\76";
goto MYfqC;
rjJoj:
include "\146\x6c\x61\147\x2e\160\150\x70";
goto Oz2JG;
nKESF:
source(); 

```

At first glance, the code seems a bit obfuscated. We will first deobfuscate it to understand what he's doing.

```php

 <?php

goto rjJoj;
l5p8t:
$variable = str_replace("challengefox", '', $variable);
goto MGxdQ;
lIReG:

function echec()
{
    goto jCY0w;
    Dm3Uc:
    source();
    goto pj4hI;
    jCY0w:
    echo "Echec.";
    goto Dm3Uc;
    pj4hI:
    exit;
    goto gPDe0;
    gPDe0:
}

goto lbiZM;
bOncl:

if ($variable === "challengefox") {
    echo "Si ce texte apparait, tu valide la premiere etape!";

    if (isset($_GET["challenge_fox"])) {
        echo "- Deuxieme etape valide!";

        if (hash("md2", $_GET["variable2"]) == "0") {
            echo "- Troisieme etape valide!";

            if (hash("sha1", $_GET["variable3"]) == $_GET["variable3"]) {
                echo "\55\40\x4f\153\x61\171\x2c\40\x76\x6f\151\x63\151\40\154\145\x20\146\154\x61\147\40\x3a\x20" . $secretflag . "\74\142\x72\x3e";
            }
        }
    }
}

goto nKESF;
HVY3V:

echo "Analyser le code ci dessous et trouver le moyen d afficher le flag.";

goto g9hQi;
lbiZM:

$variable = $_GET["variable"];

goto l5p8t;
Oz2JG:

echo "\x3c\164\151\x74\154\145\76\x43\x68\x61\154\154\145\156\147\x65\40\x46\157\x78\x3c\x2f\164\151\x74\154\x65\76";

goto E0h5E;
MGxdQ:

$query = urldecode($_SERVER["QUERY_STRING"]);

goto Z_G58;
MYfqC:

function source()
{
    goto nUBkJ;
    pqZ02:
    highlight_string(file_get_contents(__FILE__));
    goto P9KZ3;
    nUBkJ:
    echo "\x3c\x62\162\76\x3c\143\x6f\144\145\76";
    goto pqZ02;
    P9KZ3:
    echo "\74\x2f\x63\157\144\145\76";
    goto NTzIV;
    NTzIV:
}

goto lIReG;
E0h5E:
echo "Challenge Fox";
goto HVY3V;
Z_G58:

if (preg_match("/ |_/", $query)) {
    echec();
}

goto bOncl;
g9hQi:
echo "\74\142\x72\76\x3c\110\x52\76\x3c\142\162\76";
goto MYfqC;
rjJoj:
include "flag.php";
goto Oz2JG;
nKESF:
source(); 
```

We quickly understand that the interesting part is this one:

```php

if ($variable === "challengefox") {
    echo "Si ce texte apparait, tu valide la premiere etape!";

    if (isset($_GET["challenge_fox"])) {
        echo "- Deuxieme etape valide!";

        if (hash("md2", $_GET["variable2"]) == "0") {
            echo "- Troisieme etape valide!";

            if (hash("sha1", $_GET["variable3"]) == $_GET["variable3"]) {
                echo "\55\40\x4f\153\x61\171\x2c\40\x76\x6f\151\x63\151\40\154\145\x20\146\154\x61\147\40\x3a\x20" . $secretflag . "\74\142\x72\x3e";
            }
        }
    }
}
```

### First Condition

To pass the first condition, we must obtain a value of the GET parameter `variable` equal to the string `challengefox`.

We can notice that this parameter is filtered by the following line:

```php
$variable = str_replace("challengefox", '', $variable);
```
This instruction replaces the string `challengefox` with an empty string.

To obtain the string `challengefox`, we just need to add this same string between each character of the string `challengefox` as following...<br>

```
cchallengefoxhchallengefoxachallengefoxlchallengefoxlchallengefoxechallengefoxnchallengefoxgchallengefoxechallengefoxfchallengefoxochallengefoxx
```

...which, once filtered, will return `challengefox`.

### Second Condition

The main purpose of this condition is pretty clear: set a GET parameter called `challenge_fox`.

We can notice that this condition is protected by this part:

```php
$query = urldecode($_SERVER["QUERY_STRING"]);

if (preg_match("/ |_/", $query)) {
    echec();
}

```

This condition searches for space and underscore characters, then returns `echec()` function if a match is found. So we have to find a way to bypass this instruction.

After some research I came across an interesting article on bypassing IDS, IPS, and WAF by abusing PHP query string parser (<a href="https://www.secjuice.com/abusing-php-query-string-parser-bypass-ids-ips-waf/" target="_blank">Secjuice - Abusing PHP query string parser to bypass IDS, IPS, and WAF</a> )

![2](/images/bzhack/string_parser_php.png)

Looking at the red brace, we notice that it is possible to bypass our filter on spaces and underscores, by replacing with a `.`, a `+` or a `[`.

We can therefore pass the second condition like this `challenge.fox=a`

### Third Condition

```php
if (hash("md2", $_GET["variable2"]) == "0") {
    echo "- Troisieme etape valide!";
}
```

Here, we need to find a md2 hash equal to 0.

In PHP, "Type Juggling" refers to the ability of the PHP language to automatically perform implicit type conversions during arithmetic, comparisons, and other operations.

When comparing a string to a number, PHP will attempt to convert the string to a number then perform a numeric comparison.

```bash
▪ TRUE: "0e12345" == "0e54321"
▪ TRUE: "0e12345" <= "1"
▪ TRUE: "0e12345" == "0"
▪ TRUE: "0xF" == "15"
```

This means that a valid hash starting with `0e` will be equal to 0. To exploit this, we will use some <a href="https://github.com/spaze/hashes/blob/master/md2.md" target="_blank">Magic Hashes</a>. This list allows us to retrieve a string whose md2 hash starts with `0e` and therefore will be equal to `0` in PHP.

So, for this condition, we have `variable2=Oq9wqi64`.

### Last condition

```php
if (hash("sha1", $_GET["variable3"]) == $_GET["variable3"]) {
    echo " $secretflag  ";
}
```

This section is quite similar. By reading the condition, we can think that we will have to find a SHA1 hash whose plain value is itself equal to the hash. But it's quite different. Here, we will also exploit Type Juggling features to pass through our condition.

The trick here is to find a value starting with `0e` whose SHA1 hash also starts with `0e`. In this case, the condition will become `if ("0" == "0")`.

So let's go again on <a href="https://github.com/spaze/hashes/blob/master/sha1.md" target="_blank">Magic Hashes</a> in the SHA1 section and let's try to find a corresponding couple of value.

And yes ! We have several sets of values ​​that correspond to our needs !

```
0e00000000000000000000081614617300000000:0e65307525940999632287492285468259219070
0e00000000000000000000721902017120000000:0e94981159498252295418182453841140483274
0e01011001101011010001101110101100101000:0e48906523151976751117677463787111106598
0e11001000001010011000100000010001101000:0e63407184960930419027062777705081379452
0e01000001100000001010011011001000000100:0e55962072388397083814346733718698213796
0e10011110000101101000011101011010100100:0e31188585417285828785355336774237712792
0e01010111000111111010101011010111010100:0e45906344569616659428808892091261969181
0e00100001110000001111010000010011101100:0e14860258669052332549568607710438132953
0e11110000111010001001101111111110010010:0e12174258436385758552874426941686538483
0e10111110011100101100010101111010000110:0e99774398282593376043462038572281385389
0e11001111110111110010111010000011110110:0e63185221301034624940345471074357888797
0e00001010010101100100101011101110001110:0e90943988772171749054413593888105986782
```

So we have `variable3=0e00000000000000000000081614617300000000`.

### Flag

Finally, our payload looks like this:

```
/?&variable=cchallengefoxhchallengefoxachallengefoxlchallengefoxlchallengefoxechallengefoxnchallengefoxgchallengefoxechallengefoxfchallengefoxochallengefoxx&challenge.fox=a&variable2=Oq9wqi64&variable3=0e00000000000000000000081614617300000000
```

![2](/images/bzhack/flag-fox.png)


> 🚩 `ESD{ChallengeFox486217935}`

Thanks for reading !

### References

- <a href="https://owasp.org/www-pdf-archive/PHPMagicTricks-TypeJuggling.pdf" target="_blank">PHP Magic Tricks: Type Juggling</a>
- <a href="https://github.com/spaze/hashes/tree/master" target="_blank">Magic Hashes - PHP Hash Collisions</a>
- <a href="https://www.secjuice.com/abusing-php-query-string-parser-bypass-ids-ips-waf/" target="_blank">Secjuice - Abusing PHP query string parser to bypass IDS, IPS, and WAF</a>
