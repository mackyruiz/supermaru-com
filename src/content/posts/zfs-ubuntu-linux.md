---
title: "ZFS on Ubuntu Linux"
pubDate: "2016-11-02T12:44:56-07:00"
description: "This guide discusses how to setup ZFS on Ubuntu 14.04.3 LTS, based from Aaron Toponce’s guide. Environment settings: Operating System: Ubuntu 14.04 LTS Setting"
categories: ["linux"]
tags: ["cli","linux","zfs"]
urlPath: "2016/11/zfs-ubuntu-linux"
wpId: 358
---

This guide discusses how to setup ZFS on Ubuntu 14.04.3 LTS, based from [Aaron Toponce’s guide.](https://pthree.org/2012/04/17/install-zfs-on-debian-gnulinux/)

## Environment settings:

Operating System: Ubuntu 14.04 LTS

## Setting up your host:

Installation of the ZFS repository

\# sudo add-apt-repository ppa:zfs-native/stable

### Installation of ZFS dependencies

\# apt-get install spl-dkms

### Installation of Ubuntu ZFS

\# apt-get install -y ubuntu-zfs

## Finding out disk mapping

\# apt-get install -y lsscsi

\# lsscsi

```
[1:0:0:0]    cd/dvd  NECVMWar VMware IDE CDR10 1.00  /dev/sr0

[2:0:0:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sda

[2:0:1:0]    disk    ATA      INTEL SSDSC2BX01 CS01  /dev/sdb

[2:0:2:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdc

[2:0:3:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdd

[2:0:4:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sde

[2:0:5:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdf

[2:0:6:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdg

[2:0:7:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdh

[2:0:8:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdi

[2:0:9:0]    disk    SEAGATE  ST1200MM0007     0003  /dev/sdj

[2:0:10:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdk

[2:0:11:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdl

[2:0:12:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdm

[2:0:13:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdn

[2:0:14:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdo

[2:0:15:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdp

[2:0:16:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdq

[2:0:17:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdr

[2:0:18:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sds

[2:0:19:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdt

[2:0:20:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdu

[2:0:21:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdv

[2:0:22:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdw

[2:0:23:0]   disk    SEAGATE  ST1200MM0007     0003  /dev/sdx

[2:0:24:0]   enclosu Cisco    UCS-C240-M4      0224  -

[3:0:0:0]    disk    VMware   Virtual disk     1.0   /dev/sdy
```

## Creating a ZFS pool

ZFS pool is a group of spinning hard drives. In the case below, the ZFS pool tank is a group of 1TB HDDs with no RAID protection:

\# zpool create tank sdc sdd sde sdf sdg sdh –f

**Once you create your pool, you can view the status:**

\# zpool status

```
pool: tank

state: ONLINE

scan: none requested

config:

NAME        STATE     READ WRITE CKSUM

tank        ONLINE       0     0     0

sdc       ONLINE       0     0     0

sdd       ONLINE       0     0     0

sde       ONLINE       0     0     0

sdf       ONLINE       0     0     0

sdg       ONLINE       0     0     0

sdh       ONLINE       0     0     0
```

**You can list all your ZFS pools:**

\# zpool list

```
NAME   SIZE  ALLOC   FREE  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROOT

tank  6.52T  68.5K  6.52T         -     0%     0%  1.00x  ONLINE  -
```

## **Adding the ZFS Intent Log (ZIL)**

You want to make sure the dynamic system mapping of the disk (sda, sdb) does not mess you up next time you reboot your server. You want to map your ZIL drive by disk-by-id. In this case, I have a SSD, sdb, that I want to use.

\# ls -l /dev/disk/by-id/ | grep sdb

```
lrwxrwxrwx 1 root root  9 May 14 12:55 ata-INTEL_SSDSC2BX016T4K_BTHC536502FZ1P6PGN -> ../../sdb

lrwxrwxrwx 1 root root  9 May 14 12:55 wwn-0x55cd2e404c0d9cb4 -> ../../sdb
```

**Now that I have the disk-by-id, i can add the log device to my existing ZFS pool: tank:**

\# zpool add tank log /dev/disk/by-id/ata-INTEL\_SSDSC2BX016T4K\_BTHC536502FZ1P6PGN  -f

\# zpool status

```
pool: tank

state: ONLINE

scan: none requested

config:

NAME                                           STATE     READ WRITE CKSUM

tank                                           ONLINE       0     0     0

sdc                                          ONLINE       0     0     0

sdd                                          ONLINE       0     0     0

sde                                          ONLINE       0     0     0

sdf                                          ONLINE       0     0     0

sdg                                          ONLINE       0     0     0

sdh                                          ONLINE       0     0     0

logs

              ata-INTEL_SSDSC2BX016T4K_BTHC536502FZ1P6PGN  ONLINE       0     0     0
```

## Sharing your ZFS filesystem

\# zfs create tank/export

If you have a preferred mountpoint, you can mount the ZFS filesystem to your path of choice:

\# zfs set mountpoint=/opt/zfs tank/export

\# zfs list

```
NAME          USED  AVAIL  REFER  MOUNTPOINT

tank         99.5K  6.31T    19K  /tank

tank/export    19K  6.31T    19K  /opt/zfs
```

### **Sharing via NFS:**

**You want to install NFS and start the services:**

\# apt-get install -y nfs-kernel-server

\# /etc/init.d/nfs-kernel-server start

**Enable NFS share via ZFS:**

\# zfs set sharenfs=on tank/export

\# zfs set sharenfs=”rw=@10.0.0.0/8″ tank/export

\# zfs share tank/export

Verifying:

\# showmount -e 10.0.11.211

```
Export list for 10.0.11.211:

/opt/zfs 10.0.0.0/8
```
