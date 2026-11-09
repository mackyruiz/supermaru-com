---
title: "ZFS on ubuntu 16.04"
pubDate: "2017-05-11T23:19:15-07:00"
description: "On my previous post, ZFS on Ubuntu Linux, I had setup ZFS on Ubuntu 14.04 by adding a ZFS repository, installing multiple packages and such. Now on 16.04 and"
categories: ["linux"]
tags: ["linux","ubuntu","zfs"]
urlPath: "2017/05/zfs-ubuntu-16-04"
wpId: 394
---

On my previous post, [ZFS on Ubuntu Linux](http://www.supermaru.com/2016/11/zfs-ubuntu-linux/), I had setup ZFS on Ubuntu 14.04 by adding a ZFS repository, installing multiple packages and such. Now on 16.04 and 16.10, it is available by simply typing:

`sudo apt-get install zfs`

My previous post covers how to setup a ZFS Pool, creating ZIL, and sharing the ZFS filesystem. For additional documentation on setting up ZFS, i’ll refer to [this document](https://pthree.org/2012/04/17/install-zfs-on-debian-gnulinux/) by Aaron Toponce.

### A quick TL;DR on ZFS if you are unfamiliar with it:

1.  ZFS is a combined filesystem and logical volume manager designed by Sun Microsystems.
2.  Protects against data corruption
3.  Support for high storage capacity
4.  Efficient data compression
5.  Volume management
6.  Snapshots
7.  And many more features to list

Fun fact: Originally, ZFS was an acronym for Zettabyte File System. Its capable of storing 256ZB. 1ZB is equivalent of 1 million Petabytes (PB), 1 billion terabytes (TB) or 1 trillion gigabytes (GB). Thats a lot of cat videos!

### Why use ZFS?

For me, personally I like the idea of eliminating hardware RAID. I’ve personally ran into one too many dead RAID controllers, snapshot capabilities, online array construction and reassembly and the ability to use ZIL (ZFS Intent Log), which allows me to use an SSD in increase the write throughput of the system. By no means i’m an expert on storage, but ZFS is great for a home-brew NAS if you have a spare computer laying around.
