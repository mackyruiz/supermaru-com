---
title: "Debugging ESX boot medium issues"
pubDate: "2015-01-13T06:06:33-08:00"
description: "With a lot of servers in my lab, I run into my fair share of ESX boot medium issues in the lab. Typically this exhibits weird issues where the ESX host is"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware"]
tags: ["cli","kernel","vmware"]
urlPath: "2015/01/debugging-esx-boot-medium-issues"
wpId: 217
---

With a lot of servers in my lab, I run into my fair share of ESX boot medium issues in the lab. Typically this exhibits weird issues where the ESX host is online, VMs are incredibly slow or completely hung and ping-able. The quickest way I would determine of the boot media (USB, SD card, etc) is bad is trying to read any log file and get an I/O error.

```
~ # less /var/log/vmkernel.log
/var/log/vmkernel.log: Input/output error
```

If you want to go further down the rabbit hole, you can verify this by looking at SCSI error commands. Since the boot media was spewing all over the logs, it was quite easy to find it.  You can refer here for a list of [SCSI commands](http://en.wikipedia.org/wiki/SCSI_command)

```
~ # dmesg  | grep Cmd | awk '{print $5}' | sort -u | grep -v ,
0x1a -> Mode sense. Can ignore this.
0x28 -> Read errors. 
0x2a -> Write errors. 
0x85 -> ATA passthru. Can ignore this as well.
```

You can also look at the stats of the adapters by droping into VMware’s vsish utility (VMKernel Sys Info Shell)

```
/storage/scsifw/adapters/vmhba0/> cat stats
Statistics {
   Successful Commands:3190786
   Failed Commands:7025
   Blocks Read:147564437
   Failed Blocks Read:13112
   Blocks Written:138151007
   Failed Blocks Written:162368
   Read Operations:1707621
   Failed Read Operations:631
   Write Operations:1440350
   Failed Write Operations:5539
   Reserve Operations:1406
   Failed Reserve Operatiosn:0
   reservationConflicts:0
```

I’ll probably post more about finding slow iSCSI/NAS datastores sometime later.
