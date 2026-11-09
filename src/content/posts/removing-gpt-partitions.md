---
title: "Removing GPT partitions"
pubDate: "2017-02-21T18:21:52-08:00"
description: "I had one system where the disk (sde)was formatted with a GPT partition, but fdisk did not show any partitions # fdisk -l /dev/sde WARNING: GPT (GUID Partition"
categories: ["linux","tips-and-tricks"]
urlPath: "2017/02/removing-gpt-partitions"
wpId: 377
---

I had one system where the disk (sde)was formatted with a GPT partition, but fdisk did not show any partitions  
\# fdisk -l /dev/sde

WARNING: GPT (GUID Partition Table) detected on ‘/dev/sde’! The util fdisk doesn’t support GPT. Use GNU Parted.  
Disk /dev/sde: 1000.2 GB, 1000204886016 bytes  
255 heads, 63 sectors/track, 121601 cylinders, total 1953525168 sectors  
Units = sectors of 1 \* 512 = 512 bytes  
Sector size (logical/physical): 512 bytes / 512 bytes  
I/O size (minimum/optimal): 512 bytes / 512 bytes  
Disk identifier: 0x00000000

Disk /dev/sde doesn’t contain a valid partition table

I tried my usual tricks, running dd on the MBR:

```
~# dd if=/dev/zero of=/dev/sde bs=512k count=1
1+0 records in
1+0 records out
524288 bytes (524 kB) copied, 0.00314938 s, 166 MB/s
```

And even tried running wipefs, but no joy:

```
root@qa081-stctlvm-d:~# wipefs -a /dev/sde
```

I eventually stumbled across a form that I cannot seem to find anymore, where someone mentioned creating a msdos label. Sure enough, that managed to fix the issue:

```
~# parted /dev/sde
GNU Parted 2.3
Using /dev/sde
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted) mklabel msdos
(parted) quit
Information: You may need to update /etc/fstab.
```

Checking the partitions via fdisk:

```
~# fdisk -l /dev/sde

Disk /dev/sde: 1000.2 GB, 1000204886016 bytes
255 heads, 63 sectors/track, 121601 cylinders, total 1953525168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x000c2aab
```
