---
title: "Add drives without reboot on VMware Ubuntu guest"
pubDate: "2015-07-17T15:07:28-07:00"
description: "This post is on deploying a new Ubuntu VM, dynamically adding more disks, having the guest OS recognize the new drives and increasing its capacity without"
categories: ["linux","uncategorized"]
tags: ["linux","ubuntu","vmware"]
urlPath: "2015/07/add-drives-without-reboot-on-vmware-ubuntu-guest"
wpId: 275
---

This post is on deploying a new Ubuntu VM, dynamically adding more disks, having the guest OS recognize the new drives and increasing its capacity without rebooting. This is really useful for critical production servers that cannot go down for reboots like a NFS server. Lets get started.

OS: I’m using Ubuntu 12.02.4 LTS server  
OS drive: 20GB, thin provision.  
I want to add another drive to export via NFS.

Lets see what lsscsi shows connected to the VM:

```
root@nfs-1:~# lsscsi
[1:0:0:0] cd/dvd NECVMWar VMware IDE CDR10 1.00 /dev/sr0
[2:0:0:0] disk VMware Virtual disk 1.0 /dev/sda
```

On your ESX host, add the new VMDK to the VM, then install scsitools on the guest Linux VM. Scsitools will scan the SCSI bus and detect the drives without rebooting.

```
root@nfs-1:~# apt-get install -y install scsitools
```

Since lsscsi showed me that I only have one drive, sda, I’ll rescan.

```
root@nfs-1:~# rescan-scsi-bus
/sbin/rescan-scsi-bus: line 592: [: 1.03: integer expression expected
Host adapter 0 (ata_piix) found.
Host adapter 1 (ata_piix) found.
Host adapter 2 (mptspi) found.
Host adapter 3 (mptspi) found.
Scanning SCSI subsystem for new devices
Scanning host 0 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning host 1 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 1 0 0 0 ...
OLD: Host: scsi1 Channel: 00 Id: 00 Lun: 00
 Vendor: NECVMWar Model: VMware IDE CDR10 Rev: 1.00
 Type: CD-ROM ANSI SCSI revision: 05
Scanning host 2 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 2 0 0 0 ...
OLD: Host: scsi2 Channel: 00 Id: 00 Lun: 00
 Vendor: VMware Model: Virtual disk Rev: 1.0
 Type: Direct-Access ANSI SCSI revision: 02
Scanning host 3 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 3 0 0 0 ...
OLD: Host: scsi3 Channel: 00 Id: 00 Lun: 00
 Vendor: VMware Model: Virtual disk Rev: 1.0
 Type: Direct-Access ANSI SCSI revision: 02
1 new device(s) found.
0 device(s) removed.
```

You can see above that scsitools found a new drive. Lets verify below:

root@nfs-1:~# lsscsi  
\[1:0:0:0\] cd/dvd NECVMWar VMware IDE CDR10 1.00 /dev/sr0  
\[2:0:0:0\] disk VMware Virtual disk 1.0 /dev/sda  
**\[3:0:0:0\] disk VMware Virtual disk 1.0 /dev/sdb**

From here we can do whatever we want with the drive (sdb). In my case, i’ll create a LVM and can grow it whenever I need additional space.

First I’ll need to format the newly drive, /dev/sdb via fdisk.

```
root@nfs-1:~# fdisk /dev/sdb
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0xd219bc7f.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.
```

```
Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)
```

```
Command (m for help): n
Partition type:
 p primary (0 primary, 0 extended, 4 free)
 e extended
Select (default p):
Using default response p
Partition number (1-4, default 1):
Using default value 1
First sector (2048-209715199, default 2048):
Using default value 2048
Last sector, +sectors or +size{K,M,G} (2048-209715199, default 209715199):
Using default value 209715199
```

```
Command (m for help): t
Selected partition 1
Hex code (type L to list codes): 8e
Changed system type of partition 1 to 8e (Linux LVM)
```

```
Command (m for help): p
```

```
Disk /dev/sdb: 107.4 GB, 107374182400 bytes
255 heads, 63 sectors/track, 13054 cylinders, total 209715200 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0xd219bc7f
```

```
Device Boot Start End Blocks Id System
/dev/sdb1 2048 209715199 104856576 8e Linux LVM
```

```
Command (m for help): w
The partition table has been altered!
```

```
Calling ioctl() to re-read partition table.
Syncing disks.
```

Now I’ll create the Volume Group

```
root@nfs-1:~# vgcreate vgpool /dev/sdb1
 No physical volume label read from /dev/sdb1
 Physical volume "/dev/sdb1" successfully created
 Volume group "vgpool" successfully created
```

Create the logical volume

```
root@nfs-1:~# lvcreate -L 90G -n lvstuff vgpool
 Logical volume "lvstuff" created
```

Format and mount the logical volume. I’ll format it as a ext3 filesystem.

```
root@nfs-1:~# mkfs -t ext3 /dev/vgpool/lvstuff
mke2fs 1.42 (29-Nov-2011)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
5898240 inodes, 23592960 blocks
1179648 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=4294967296
720 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks:
 32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208,
 4096000, 7962624, 11239424, 20480000
```

```
Allocating group tables: done
Writing inode tables: done
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information: done
```

```
root@nfs-1:~# mkdir /mnt/data
root@nfs-1:~# mount -t ext3 /dev/vgpool/lvstuff /mnt/data/
```

Verify that it is indeed mounted and all the space is there

```
root@nfs-1:~# mount | grep data
/dev/mapper/vgpool-lvstuff on /mnt/data type ext3 (rw)
```

```
root@nfs-1:~# df -h | grep data
/dev/mapper/vgpool-lvstuff 89G 184M 84G 1% /mnt/data
```

To have a persistent mount during bootup, you can add this in /etc/fstab. First you’ll need to find out the drives UUID

```
root@nfs-1:~# blkid /dev/mapper/vgpool-lvstuff
/dev/mapper/vgpool-lvstuff: UUID="7b1a695d-9688-4b98-866f-946d6634674b" TYPE="ext3"
```

Add this format into /etc/fstab like so:

```
UUID=7b1a695d-9688-4b98-866f-946d6634674b /mnt/data     ext3    defaults        0       2
```

Now that we have the data path setup, all thats left is setting up a NFS server.

```
root@nfs-1:~# apt-get install nfs-kernel-server
```

edit /etc/exports and add the mountpoint

```
/mnt/data        *(rw,sync,no_root_squash)
```

Restart the NFS server

```
root@nfs-1:~# /etc/init.d/nfs-kernel-server restart
```

Verify that the NFS export is working. I’ll do this on a separate VM:

```
root@macky-vm1:~# showmount -e 10.64.1.12
Export list for 10.64.1.12:
/mnt/data (everyone)
```

Putting everything together: Now we have a Linux VM with a 20GB OS drive and a 100GB drive in a LVM, which is being exported via NFS. Now lets go through the motions of adding additional space to the LVM without bringing down the server. Add the new vmdk to the VM. run rescan-scsi-bus

```
root@nfs-1:~# rescan-scsi-bus
/sbin/rescan-scsi-bus: line 592: [: 1.03: integer expression expected
Host adapter 0 (ata_piix) found.
Host adapter 1 (ata_piix) found.
Host adapter 2 (mptspi) found.
Host adapter 3 (mptspi) found.
Scanning SCSI subsystem for new devices
Scanning host 0 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning host 1 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 1 0 0 0 ...
OLD: Host: scsi1 Channel: 00 Id: 00 Lun: 00
 Vendor: NECVMWar Model: VMware IDE CDR10 Rev: 1.00
 Type: CD-ROM ANSI SCSI revision: 05
Scanning host 2 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 2 0 0 0 ...
OLD: Host: scsi2 Channel: 00 Id: 00 Lun: 00
 Vendor: VMware Model: Virtual disk Rev: 1.0
 Type: Direct-Access ANSI SCSI revision: 02
Scanning host 3 for SCSI target IDs 0 1 2 3 4 5 6 7, all LUNs
Scanning for device 3 0 0 0 ...
OLD: Host: scsi3 Channel: 00 Id: 00 Lun: 00
 Vendor: VMware Model: Virtual disk Rev: 1.0
 Type: Direct-Access ANSI SCSI revision: 02
Scanning for device 3 0 1 0 ...
NEW: Host: scsi3 Channel: 00 Id: 01 Lun: 00
 Vendor: VMware Model: Virtual disk Rev: 1.0
 Type: Direct-Access ANSI SCSI revision: 02
1 new device(s) found.
0 device(s) removed.
```

```
root@nfs-1:~# ls /dev/sd?
/dev/sda /dev/sdb /dev/sdc
```

I see that now sdc is available. Lets format the drive with a LVM partition. See above on how to create a partition via fdisk and pvcreate so that LVM can recognize it.

Add the new drive to the volume group

```
root@nfs-1:~# vgextend vgpool /dev/sdc1
 Volume group "vgpool" successfully extended
```

Extend the Logical Volume

```
root@nfs-1:~# lvextend -L+90G /dev/vgpool/lvstuff
 Extending logical volume lvstuff to 183.00 GiB
 Logical volume lvstuff successfully resized
```

Extend the File System

```
root@nfs-1:~# resize2fs /dev/vgpool/lvstuff
resize2fs 1.42 (29-Nov-2011)
Filesystem at /dev/vgpool/lvstuff is mounted on /mnt/data; on-line resizing required
old_desc_blocks = 6, new_desc_blocks = 12
Performing an on-line resize of /dev/vgpool/lvstuff to 47972352 (4k) blocks.
The filesystem on /dev/vgpool/lvstuff is now 47972352 blocks long.
```

Then verify on the NFS server that the partition has grown:  
From the NFS server:

```
root@nfs-1:~# df -h | grep data
/dev/mapper/vgpool-lvstuff 181G 188M 171G 1% /mnt/data
```

From another VM mounting the NFS export:

```
10.64.1.12:/mnt/data 181G 188M 171G 1% /mnt/nfs1
```
