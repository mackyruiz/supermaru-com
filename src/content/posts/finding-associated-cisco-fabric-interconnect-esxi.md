---
title: "Finding an associated Cisco Fabric Interconnect in ESXi"
pubDate: "2017-02-28T18:30:27-08:00"
description: "If you have SSH access to your ESX server, smbiosDump has some very useful information. If you look in “OEM Strings: #14”, you can see some very useful"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware"]
tags: ["cisco","esxi","fabric-interconnect","ucsm"]
urlPath: "2017/02/finding-associated-cisco-fabric-interconnect-esxi"
wpId: 382
---

If you have SSH access to your ESX server, smbiosDump has some very useful information. If you look in “OEM Strings: #14”, you can see some very useful information:

\[root@ucs-test1:~\] smbiosDump | grep “OEM Strings: #14” -A 4  
OEM Strings: #14  
$SPI:rack-unit-13 <- Server ID  
$SPT:hx-nodes <- Service Profile Template  
$SYS:test-fi1 <- Fabric Interconnect

This info can be nicely scripted so you can find what host is associated with which FI, or what server ID (rack-unit) shows via UCSM.
