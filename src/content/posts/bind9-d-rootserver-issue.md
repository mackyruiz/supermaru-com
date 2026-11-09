---
title: "BIND9 d.rootserver issue"
pubDate: "2014-09-05T21:38:51-07:00"
description: "Last night I encountered an interesting problem where my master DNS server started to fail resolving hostnames, but my secondary DNS seemed to be functional. VM"
categories: ["linux"]
tags: ["bind","dns"]
urlPath: "2014/09/bind9-d-rootserver-issue"
wpId: 134
---

Last night I encountered an interesting problem where my master DNS server started to fail resolving hostnames, but my secondary DNS seemed to be functional.

**VM setup:**

-   CentOS release 6.5 (Final)
-   BIND 9.8.2rc1-RedHat-9.8.2-0.23.rc1.el6\_5.1

All seemed fine with my DNS VM. Network is okay, no one had updated DNS records in the past day, no hardware resource issues, nothing in dmesg, no system errors in /var/log/messages,  but I’ve noticed log spews regarding d.root-servers.net.

```
 04-Sep-2014 18:23:10.520 general: warning: checkhints: d.root-servers.net/A (128.8.10.90) extra record in hints
 04-Sep-2014 18:23:20.071 general: warning: checkhints: d.root-servers.net/A (199.7.91.13) missing from hints
 04-Sep-2014 18:23:20.071 general: warning: checkhints: d.root-servers.net/A (128.8.10.90) extra record in hints
```

And to be sure that master DNS is really having issues, i ran `dig google.com` against my master and slave DNS server

```
root@macky-vm1:~# dig google.com
; <<>> DiG 9.8.1-P1 <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 31634
;; flags: qr rd ra; QUERY: 1, ANSWER: 0, AUTHORITY: 0, ADDITIONAL: 0
;; QUESTION SECTION:
;google.com. IN A
;; Query time: 7 msec
;; SERVER: 10.x.x.8#53(10.x.x.8)
;; WHEN: Thu Sep 4 18:22:01 2014
;; MSG SIZE rcvd: 28
```

```
root@macky-vm1:~# dig @10.x.x.9 google.com
; <<>> DiG 9.8.1-P1 <<>> @10.x.x.9 google.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 55401
;; flags: qr rd ra; QUERY: 1, ANSWER: 11, AUTHORITY: 4, ADDITIONAL: 4
;; QUESTION SECTION:
;google.com. IN A
;; ANSWER SECTION:
google.com. 125 IN A 74.125.239.97
google.com. 125 IN A 74.125.239.104
..
..
google.com. 125 IN A 74.125.239.98
;; AUTHORITY SECTION:
google.com. 155974 IN NS ns2.google.com.
..
..
google.com. 155974 IN NS ns4.google.com.
;; ADDITIONAL SECTION:
ns2.google.com. 155974 IN A 216.239.34.10
..
..
ns4.google.com. 155974 IN A 216.239.38.10
;; Query time: 7 msec
;; SERVER: 10.x.x.9#53(10.x.x.9)
;; WHEN: Thu Sep 4 18:22:05 2014
;; MSG SIZE rcvd: 340
```

A quick google search pointed me to this RHEL bug: [https://bugzilla.redhat.com/show\_bug.cgi?id=901741](https://bugzilla.redhat.com/show_bug.cgi?id=901741). Seemed that d.root server changed its IP address in 3 Jan 2013 and got fixed in these bind versions:

-   bind-9.9.2-7.P1.fc19
-   bind-9.9.2-7.P1.fc18
-   bind-9.9.2-4.P1.fc17
-   bind-9.8.4-4.P1.fc16

Oddly enough this VM was recently deployed and BIND9 installed via yum after doing a yum-update. Since my bind version  is 9.8.2 the fix was not in, we had manually updated named.ca, restarted BIND and we were good to go.
