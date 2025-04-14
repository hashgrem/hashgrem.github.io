---
title: "[Pointer Overflow] - Understanding Nonsense"
date: 2025-01-05
author: me
categories: [writeups]
tags: ["Reverse", "Scripting", "Pointer Overflow"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*Oh, boy... Only Wave 2 and I'm already exhausted. Whatever the issue, I just can't be bothered to finish putting this challenge together. Here, this what I have so far. Started working on the decode function and gave up. You go ahead and do the rest and the flag is yours! And if Prof. Johnson asks, tell him this was really well done or I'll get in trouble.*



<br>


_____________________________________________________



<br>

**Table of contents:**

- <a href="#given-file">Given file</a>
- <a href="#solve">Solve</a>

<br>

_____________________________________________________


<br>

## Given file

We are given the following `C` file. 

```c
#include <stdio.h>
#include <string.h>

// Convert each byte of the flag to hex and print it
void print_flag_hex(unsigned char *flag, int length, int step) {
    printf("Flag after reverse step %d: ", step);
    for (int i = 0; i < length; i++) {
        printf("%02x", flag[i]);  // Print each byte in hexadecimal
    }
    printf("\n");
}

// Reverse the modification of the flag bytes based on the seed
void reverse_modify_flag(unsigned char *flag, unsigned int seed) {
    int length = strlen((char *)flag);

    for (int i = 0; i < length; i++) {
        flag[i] = (flag[i] - (seed % 10)) % 256;  // Reverse each byte modification
        seed = seed / 10;
        if (seed == 0) {
            seed = 88974713;  // Reset seed if it runs out
        }
    }
}

int main() {
    unsigned char encoded_flag[] = { 0x8e, 0x79, 0xa9, 0x9c, 0xac, 0xd5, 0xc5, 0xc7, 0x91, 0x7a, 0xa5, 0x8a, 0xb8, 0x8d, 0xc6, 0x81, 0x55, 0x83, 0xa5, 0x59, 0x7b, 0xb9, 0x87, 0xb8, 0x51, 0x69, 0x7b, 0x58, 0xbb, 0x8b, 0xcd};

    unsigned int seed = 88974713;
    int length = sizeof(encoded_flag);

    printf("Encoded flag: ");
    print_flag_hex(encoded_flag, length, 0);

    // Reverse the modifications 10 times (finish this!)
    printf("Decode function not added yet!");

    printf("Decoded flag (plaintext in hex): ");
    print_flag_hex(encoded_flag, length, 0);  // Print final decoded flag in hex

    return 0;
}
```

## Solve

Here is my python script:

```python
def print_flag_hex(flag, step):
    hex_flag = ''.join(f'{byte:02x}' for byte in flag)
    print(f"Reverse step {step}: {hex_flag}")

def reverse_modify_flag(flag, seed):
    length = len(flag)
    for i in range(length):
        flag[i] = (flag[i] - (seed % 10)) % 256  # Reverse each byte modification
        seed = seed // 10
        if seed == 0:
            seed = 88974713  

    return flag


encoded_flag = [0x8e, 0x79, 0xa9, 0x9c, 0xac, 0xd5, 0xc5, 0xc7, 0x91, 0x7a, 0xa5, 0x8a, 0xb8, 0x8d, 0xc6, 0x81, 
                0x55, 0x83, 0xa5, 0x59, 0x7b, 0xb9, 0x87, 0xb8, 0x51, 0x69, 0x7b, 0x58, 0xbb, 0x8b, 0xcd]

seed = 88974713

print("Encoded flag:")
print_flag_hex(encoded_flag, 0)

# Reverse the modifications 10 times
for step in range(1, 11): 
    encoded_flag = reverse_modify_flag(encoded_flag, seed)
    print_flag_hex(encoded_flag, step)

decoded_flag_ascii = ''.join(chr(byte) for byte in encoded_flag)
print(f"Flag: {decoded_flag_ascii}")
```

10 iterations of the reverse_modify_flag function are performed, as suggested by the comment 'Reverse the modifications 10 times'. Each time, the function modifies the byte array according to the defined logic. After each iteration, I printed the flag in hexadecimal to track its progress.

```bash
python solve.py

Encoded flag:
Reverse step 0: 8e79a99cacd5c5c7917aa58ab88dc6815583a5597bb987b851697b58bb8bcd
Reverse step 1: 8b78a298a5ccbdbf8e799e86b184be7952829e5574b07fb04e687454b482c5
Reverse step 2: 88779b949ec3b5b78b789782aa7bb6714f8197516da777a84b676d50ad79bd
Reverse step 3: 8576949097baadaf8877907ea372ae694c80904d669e6fa04866664ca670b5
Reverse step 4: 82758d8c90b1a5a78576897a9c69a661497f89495f95679845655f489f67ad
Reverse step 5: 7f74868889a89d9f8275827695609e59467e8245588c5f9042645844985ea5
Reverse step 6: 7c737f84829f95977f747b728e579651437d7b41518357883f63514091559d
Reverse step 7: 797278807b968d8f7c73746e874e8e49407c743d4a7a4f803c624a3c8a4c95
Reverse step 8: 7671717c748d858779726d6a804586413d7b6d39437147783961433883438d
Reverse step 9: 73706a786d847d7f76716666793c7e393a7a66353c683f7036603c347c3a85
Reverse step 10: 706f6374667b757773705f627233763137795f31355f3768335f353075317d
Flag: poctf{uwsp_br3v17y_15_7h3_50u1}
```

> 🚩 `poctf{uwsp_br3v17y_15_7h3_50u1}`

Thanks for reading !