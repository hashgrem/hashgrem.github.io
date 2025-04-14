---
title: "[Pointer Overflow] - A Question Of Perspective"
date: 2025-01-04
author: me
categories: [writeups]
tags: ["Crypto", "Scripting", "Pointer Overflow"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*You have been hired by a tech company to assess the security of thier quantum communication system. The system uses the BB84 protocol for key distribution. During your assessment, you've intercepted some qubits and their bases during an exchange between Alice and Bob, but some of Bob's measurements are incorrect at every third qubit due to an eavesdropping scenario. Since this is a new system still in testing, the seed space is restricted to positive integers between 1 and 100.*


<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#given-file">Given File</a>
- <a href="#solve">Solve</a>

<br>

_____________________________________________________


<br>

## Given File

```python
Qubits = [0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1]

Bases = ['R', 'R', 'D', 'R', 'R', 'R', 'R', 'R', 'D', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'D', 'R', 'D', 'D', 'R', 'R', 'D', 'D', 'D', 'R', 'R', 'D', 'R', 'R', 'D', 'R', 'D', 'D', 'D', 'R', 'D', 'R', 'D', 'R', 'D', 'D', 'R', 'R', 'R', 'R', 'D', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'R', 'D', 'D', 'R', 'D', 'R', 'R', 'R', 'R', 'D', 'D', 'D', 'R', 'D', 'R', 'R', 'R', 'D', 'D', 'D', 'R', 'R', 'D', 'R', 'D', 'D']

Measurements = [0, 1, ?, 1, 0, ?, 1, 1, ?, 0, 1, ?, 0, 1, ?, 0, 1, ?, 1, 0, ?, 1, 0, ?, 0, 1, ?, 0, 1, ?, 1, 0, ?, 0, 0, ?, 0, 1, ?, 0, 1, ?, 1, 1, ?, 1, 0, ?, 1, 0, ?, 0, 1, ?, 0, 1, ?, 0, 1, ?, 1, 0, ?, 1, 0, ?, 0, 1, ?, 0, 0, ?, 0, 1, ?, 1, 1, ?, 1, 1]

Encrypted Message = [0x23, 0x59, 0x86, 0x1e, 0x60, 0xcf, 0xdc, 0x4e, 0x6a, 0x0b, 0x0c, 0x50, 0xd4, 0x5a, 0x71, 0x87, 0xdb, 0x0c, 0x46, 0x1d, 0x63, 0x44, 0xba, 0x5e, 0x37, 0xd3, 0x9a, 0x4b, 0x77, 0x4b, 0x3d, 0x4b]
```

## Solve

Reconstructing the Key:

-   We loop through the qubits and measurements.
    For positions where Bob's measurement is incorrect (None), we assume the qubit value is correct.
    For positions where the bases match ('R'), we use Bob's measurement directly.

Decrypting the Message:

-   The key is applied to the encrypted message via XOR.
    We convert 8 bits of the key at a time to a byte and XOR it with the corresponding byte in the encrypted message.

Here is my `solve.py` file :

```python
def recreate_key(qubits, bases, measurements):
    key = []
    for i in range(len(qubits)):
        if measurements[i] is None:
            corrected_measurement = qubits[i]
            key.append(corrected_measurement)
        else:
            if bases[i] == 'R':  
                key.append(measurements[i])
            else:
                key.append(measurements[i])
    
    key_repeated = (key * ((len(encrypted_message) * 8) // len(key) + 1))[:len(encrypted_message) * 8]
    return key_repeated


def decrypt_message(encrypted_message, key):
    decrypted_message = []
    for i in range(len(encrypted_message)):
        key_byte = int(''.join(map(str, key[i*8:(i+1)*8])), 2)
        decrypted_byte = encrypted_message[i] ^ key_byte
        decrypted_message.append(decrypted_byte)
    return decrypted_message

# Given data
qubits = [0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1]

bases = ['R', 'R', 'D', 'R', 'R', 'R', 'R', 'R', 'D', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'D', 'R', 'D', 'D', 'R', 'R', 'D', 'D', 'D', 'R', 'R', 'D', 'R', 'R', 'D', 'R', 'D', 'D', 'D', 'R', 'D', 'R', 'D', 'R', 'D', 'D', 'R', 'R', 'R', 'R', 'D', 'R', 'R', 'R', 'D', 'D', 'D', 'D', 'R', 'D', 'D', 'R', 'D', 'R', 'R', 'R', 'R', 'D', 'D', 'D', 'R', 'D', 'R', 'R', 'R', 'D', 'D', 'D', 'R', 'R', 'D', 'R', 'D', 'D']

measurements = [0, 1, None, 1, 0, None, 1, 1, None, 0, 1, None, 0, 1, None, 0, 1, None, 1, 0, None, 1, 0, None, 0, 1, None, 0, 1, None, 1, 0, None, 0, 0, None, 0, 1, None, 0, 1, None, 1, 1, None, 1, 0, None, 1, 0, None, 0, 1, None, 0, 1, None, 0, 1, None, 1, 0, None, 1, 0, None, 0, 1, None, 0, 0, None, 0, 1, None, 1, 1, None, 1, 1]

encrypted_message = [0x23, 0x59, 0x86, 0x1e, 0x60, 0xcf, 0xdc, 0x4e, 0x6a, 0x0b, 0x0c, 0x50, 0xd4, 0x5a, 0x71, 0x87, 0xdb, 0x0c, 0x46, 0x1d, 0x63, 0x44, 0xba, 0x5e, 0x37, 0xd3, 0x9a, 0x4b, 0x77, 0x4b, 0x3d, 0x4b]

key = recreate_key(qubits, bases, measurements)

decrypted_message = decrypt_message(encrypted_message, key)

decrypted_text = ''.join(map(chr, decrypted_message))

print(decrypted_text)
#poctf{uwsp_f10w3r5_f0r_41g3rn0n}
```

> 🚩 `poctf{uwsp_f10w3r5_f0r_41g3rn0n}`

Thanks for reading !