---
title: "verify dhcpd.conf for syntax errors"
pubDate: "2017-08-07T14:02:48-07:00"
description: "In CentOS you can check to see if your dhcpd.conf file has any syntax errors before you restart DHCP and it fails to come up. You’ll need to run a command"
categories: ["data-center","linux","tips-and-tricks"]
tags: ["dhcp","linux","networking"]
urlPath: "2017/08/verify-dhcpd-conf-syntax-errors"
wpId: 476
---

In CentOS you can check to see if your dhcpd.conf file has any syntax errors before you restart DHCP and it fails to come up.

You’ll need to run a command called dhcpd and point it to your configuration file like this:

```
[root@dhcp-server ~]# dhcpd -t -cf /etc/dhcp/dhcpd.conf
```

   
If you run into any syntax errors, it will point it out for you like so:

```
[root@dhcp-server ~]# dhcpd -t -cf /etc/dhcp/dhcpd.conf
Internet Systems Consortium DHCP Server 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/
/etc/dhcp/dhcpd.conf line 474: semicolon expected.
server-a {
^
/etc/dhcp/dhcpd.conf line 476: fixed-address parameter not allowed here.
fixed-address 192.168.1.50;
^
/etc/dhcp/dhcpd.conf line 476: expecting a parameter or declaration
```

If your configuration is good, it should come up clean like so:

```
Internet Systems Consortium DHCP Server 4.1.1-P1
Copyright 2004-2010 Internet Systems Consortium.
All rights reserved.
For info, please visit https://www.isc.org/software/dhcp/
```
