---
title: "setfacl"
pubDate: "2015-01-20T20:13:29-08:00"
description: "This is a utility that sets Access Control Lists (ACLs) for files and directories for linux hosts. I’m managing a Linux host on AWS and a design firm is working"
categories: ["linux","security"]
tags: ["authentication","cli","linux"]
urlPath: "2015/01/setfacl"
wpId: 245
---

This is a utility that sets Access Control Lists (ACLs) for files and directories for linux hosts.  I’m managing a Linux host on AWS and a design firm is working on the website itself. Even though the host itself is a sandbox webserver, I don’t want to give out root credentials – so we set ACLs.

Lets take a look at an example:

User _ec2-user_ wants to read, write, and executable permissions on directory _/home/web._ 

This is how you set the permissions:

```
[ec2-user@sandbox html]$ sudo setfacl -m u:ec2-user:rwx /home/web
```

The **\-m** option sets the ACL for the file or directory.

The **u:** option  specifies the user you wish to grant access

The **r** option allows read access

The **w** option allows write access

The **x** option removes previous ACLs

You can look at more flags and read more on setfacl here: [http://linux.die.net/man/1/setfacl](http://linux.die.net/man/1/setfacl)
