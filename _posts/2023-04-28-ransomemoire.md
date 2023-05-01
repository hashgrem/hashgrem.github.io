---
title: "[FCSC 2023] - Ransomémoire"
date: 2023-04-30
author: me
categories: [writeups]
tags: ["Forensic", "FCSC"]
---

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css">
<link rel="stylesheet" href="/assets/css/lil-bootstrap.css">
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<br>

*Vous vous préparez à analyser une capture mémoire et vous notez quelques informations sur la machine avant de plonger dans l'analyse :*
- *nom d'utilisateur,*
- *nom de la machine,*
- *navigateur utilisé.*

*Le flag est au format* `FCSC{<nom d'utilisateur>:<nom de la machine>:<nom du navigateur>}` *où :*

- `<nom d'utilisateur>` *est le nom de l'utilisateur qui utilise la machine,*
- `<nom de la machine>` *est le nom de la machine analysée et*
- `<nom du navigateur>` *est le nom du navigateur en cours d'exécution.*

*Par exemple :* `FCSC{toto:Ordinateur-de-jojo:Firefox}`

<br>

_____________________________________________________

## Given files

We are given a Windows memory dump file `fcsc.dmp`

To complete this challenge, I used <a href='https://github.com/volatilityfoundation/volatility3' target="_blank">Volatility 3</a>

## Recon

Firstly, I performed a `windows.info` in order to get general informations about the OS

```
python .\vol.py -f .\fcsc.dmp windows.info

Volatility 3 Framework 1.0.0
Progress:  100.00               PDB scanning finished
Variable        Value

Kernel Base     0xf8054b615000
DTB     0x1aa000
Is64Bit True
IsPAE   False
primary 0 WindowsIntel32e
memory_layer    1 Elf64Layer
base_layer      2 FileLayer
KdVersionBlock  0xf8054c224398
Major/Minor     15.19041
MachineType     34404
KeNumberProcessors      4
SystemTime      2023-04-17 17:24:50
NtSystemRoot    C:\Windows
NtProductType   NtProductWinNt
NtMajorVersion  10
NtMinorVersion  0
PE MajorOperatingSystemVersion  10
PE MinorOperatingSystemVersion  0
PE Machine      34404
```


## Getting the Browser's name

>Volatility's "pstree" command allows you to view the hierarchy of running processes
{: .prompt-tip }

So let's run this command and hope to find a browser !

```
python .\vol.py -f .\fcsc.dmp windows.pstree

Volatility 3 Framework 1.0.0
Progress:  100.00               PDB scanning finished
PID     PPID    ImageFileName   Offset(V)       Threads Handles SessionId       Wow64   CreateTime      ExitTime
4       0       System  0x818688016080  185     -       N/A     False   2023-04-16 21:46:14.000000      N/A
* 380   4       smss.exe        0x818688016080  2       -       N/A     False   2023-04-16 21:46:14.000000      N/A
* 1484  4       MemCompression  0x818688016080  26      -       N/A     False   2023-04-16 21:46:23.000000      N/A
* 108   4       Registry        0x818688016080  4       -       N/A     False   2023-04-16 21:45:59.000000      N/A
480     464     csrss.exe       0x818688016080  13      -       0       False   2023-04-16 21:46:20.000000      N/A
556     548     csrss.exe       0x818688016080  14      -       1       False   2023-04-16 21:46:20.000000      N/A
572     464     wininit.exe     0x818688016080  3       -       0       False   2023-04-16 21:46:21.000000      N/A
* 696   572     services.exe    0x818688016080  8       -       0       False   2023-04-16 21:46:21.000000      N/A
** 2560 696     svchost.exe     0x818688016080  18      -       0       False   2023-04-16 21:46:57.000000      N/A
....
....
*** 4072        3928    brave.exe       0x818688016080  31      -       1       False   2023-04-17 17:21:31.000000     N/A
**** 4160       4072    brave.exe       0x818688016080  18      -       1       False   2023-04-17 17:22:11.000000     N/A
**** 2844       4072    brave.exe       0x818688016080  7       -       1       False   2023-04-17 17:21:44.000000     N/A
**** 5064       4072    brave.exe       0x818688016080  8       -       1       False   2023-04-17 17:21:39.000000     N/A
**** 3952       4072    brave.exe       0x818688016080  14      -       1       False   2023-04-17 17:21:44.000000     N/A
**** 5500       4072    brave.exe       0x818688016080  15      -       1       False   2023-04-17 17:21:46.000000     N/A
**** 4060       4072    brave.exe       0x818688016080  12      -       1       False   2023-04-17 17:21:44.000000     N/A
7156    7048    OneDrive.exe    0x818688016080  20      -       1       False   2023-04-16 21:48:32.000000      N/A
* 2296  7156    Microsoft.Shar  0x818688016080  0       -       1       False   2023-04-17 17:16:06.000000      2023-04-17 17:16:08.000000
6808    6612    brave.exe       0x818688016080  10      -       1       False   2023-04-17 17:16:19.000000      N/A
* 3144  6808    brave.exe       0x818688016080  0       -       1       False   2023-04-17 17:18:04.000000      2023-04-17 17:18:58.000000
960     1528    BraveUpdate.ex  0x818688016080  3       -       0       True    2023-04-17 17:16:26.000000      N/A

```

We can see that brave is running !

So we have our first part of the flag : `Brave`


## Find the computer's name

In order to get the computer's name, I looked for Windows Registry Keys more specifically towards `ControlSet001\Control\ComputerName\ComputerName` key.

We can then display the content of the key with `PrintKey` function:

```
python .\vol.py -f .\fcsc.dmp windows.registry.printkey.PrintKey --key "ControlSet001\Control\ComputerName\ComputerName"

Volatility 3 Framework 1.0.0
Progress:  100.00               PDB scanning finished
Last Write Time Hive Offset     Type    Key     Name    Data    Volatile

-       0xe306c7864000  Key     ?\ControlSet001\Control\ComputerName\ComputerName       -               -
2023-04-04 17:24:39.000000      0xe306c7889000  REG_SZ  \REGISTRY\MACHINE\SYSTEM\ControlSet001\Control\ComputerName\ComputerName        (Default)      "mnmsrvc"        False
2023-04-04 17:24:39.000000      0xe306c7889000  REG_SZ  \REGISTRY\MACHINE\SYSTEM\ControlSet001\Control\ComputerName\ComputerName        ComputerName   "DESKTOP-PI234GP"        False
-       0xe306c8327000  Key     ?\ControlSet001\Control\ComputerName\ComputerName       -               -
-       0xe306c8bee000  Key     ?\ControlSet001\Control\ComputerName\ComputerName       -               -
-       0xe306c8d03000  Key     ?\ControlSet001\Control\ComputerName\ComputerName       -               -
```

And here we have our computer name: `DESKTOP-PI234GP`.

## Looking for a username

For this final part, I looked for the `hivelist` registry which allows us to view the registry files that are currently loaded in memory, as well as their location on the hard disk.

```
python .\vol.py -f .\fcsc.dmp windows.registry.hivelist

Volatility 3 Framework 1.0.0
Progress:  100.00               PDB scanning finished
Offset  FileFullPath    File output

0xe306c7864000          Disabled
0xe306c7889000  \REGISTRY\MACHINE\SYSTEM        Disabled
0xe306c8327000  \REGISTRY\MACHINE\HARDWARE      Disabled
0xe306c8bee000  \SystemRoot\System32\Config\DEFAULT     Disabled
0xe306c8d03000  \SystemRoot\System32\Config\SAM Disabled
0xe306c8d0a000  \SystemRoot\System32\Config\SECURITY    Disabled
0xe306c8d06000  \SystemRoot\System32\Config\SOFTWARE    Disabled
0xe306c8d9c000  \Device\HarddiskVolume1\Boot\BCD        Disabled
0xe306cb3e3000  \??\C:\Windows\ServiceProfiles\NetworkService\NTUSER.DAT        Disabled
0xe306cb63f000  \SystemRoot\System32\Config\BBI Disabled
0xe306cb642000  \??\C:\Windows\ServiceProfiles\LocalService\NTUSER.DAT  Disabled
0xe306cc809000  \??\C:\Windows\AppCompat\Programs\Amcache.hve   Disabled
0xe306cd2cd000  \??\C:\Users\Admin\ntuser.dat   Disabled
0xe306cd2ca000  \??\C:\Users\Admin\AppData\Local\Microsoft\Windows\UsrClass.dat Disabled
0xe306ce203000  \??\C:\ProgramData\Microsoft\Windows\AppRepository\Packages\Microsoft.Windows.StartMenuExperienceHost_10.0.19041.1023_neutral_neutral_cw5n1h2txyewy\ActivationStore.dat Disabled
0xe306ce22e000  \??\C:\Windows\ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\State\dosvcState.dat Disabled
0xe306ce115000  \??\C:\Users\Admin\AppData\Local\Packages\Microsoft.Windows.StartMenuExperienceHost_cw5n1h2txyewy\Settings\settings.dat Disabled
0xe306ce161000  \??\C:\ProgramData\Microsoft\Windows\AppRepository\Packages\Microsoft.Windows.Search_1.14.8.19041_neutral_neutral_cw5n1h2txyewy\ActivationStore.dat     Disabled
0xe306ce0b6000  \??\C:\Users\Admin\AppData\Local\Packages\Microsoft.Windows.Search_cw5n1h2txyewy\Settings\settings.dat  Disabled
0xe306cee5c000  \??\C:\ProgramData\Microsoft\Windows\AppRepository\Packages\MicrosoftWindows.Client.CBS_120.2212.4190.0_x64__cw5n1h2txyewy\ActivationStore.dat  Disabled
0xe306cf1cf000  \??\C:\Users\Admin\AppData\Local\Packages\MicrosoftWindows.Client.CBS_cw5n1h2txyewy\Settings\settings.dat       Disabled
0xe306cf693000  \??\C:\ProgramData\Microsoft\Windows\AppRepository\Packages\Microsoft.Windows.SecHealthUI_10.0.19041.1865_neutral__cw5n1h2txyewy\ActivationStore.dat    Disabled
0xe306d0246000  \??\C:\ProgramData\Microsoft\Windows\AppRepository\Packages\Microsoft.Windows.ShellExperienceHost_10.0.19041.1949_neutral_neutral_cw5n1h2txyewy\ActivationStore.dat     Disabled
0xe306cbb46000  \??\C:\Users\Admin\AppData\Local\Packages\Microsoft.Windows.ShellExperienceHost_cw5n1h2txyewy\Settings\settings.dat     Disabled
0xe306d1a70000  \SystemRoot\System32\config\DRIVERS     Disabled
0xe306d1097000  \??\C:\Windows\System32\config\COMPONENTS       Disabled
0xe306d1728000  \??\C:\Windows\System32\SMI\Store\Machine\SCHEMA.DAT    Disabled
```

The Users folder is very interesting and allows us to discover an `Admin` account on the system.

## Flag

We can now bring the parts together which gives us `Admin:DESKTOP-PI234GP:Brave`

> 🚩`FCSC{Admin:DESKTOP-PI234GP:Brave}`