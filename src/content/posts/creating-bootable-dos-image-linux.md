---
title: "Creating a bootable DOS image in Linux"
pubDate: "2015-01-20T07:21:12-08:00"
description: "Today, our cellphones are more powerful than a vintage supercomputer that helped NASA bring astronauts to the moon in 1969. With all the advancement in"
categories: ["linux"]
tags: ["bootable-image","cli","dos","ubuntu"]
urlPath: "2015/01/creating-bootable-dos-image-linux"
wpId: 230
---

Today, our cellphones are more powerful than a vintage supercomputer that helped NASA bring astronauts to the moon in 1969. With all the advancement in technology, some hardware manufacturers require you to flash BIOS or firmware with DOS. Okay maybe the comparison from hardware in 1969 and 2015 is a bit extreme, but you get the point. Forget keeping a floppy USB drive, your limited to capacity. You can create bootable DOS USB drives, and they are great for one or two systems. But when you have a large quantity to upgrade at once, then having a ISO to mount like IPMI’s virtual media is perfect. You can do the upgrades from the comfort of your desk.Here is instructions on getting a DOS image created. I used Ubuntu Linux 14.04 LTS.

Head over to [fdos.org](http://www.fdos.org/bootdisks/ "fdos.org") and download and unzip **FDOEMCD.builder.zip**. You should now have a directory called “**FDOEMCD**“.

```
macky@maru-lx:~/Documents/bootable-dos$ ls
FDOEMCD FDOEMCD.builder.zip
```

Go ahead and go into **FD0EMCD**, which is what I’ll refer to as the working directory, then in **CDROOT** is where you can dump your \*.exe files in. Once you are done, go back to the working directory and run the following:

```
mkisofs -o dos.iso -b isolinux/isolinux.bin -no-emul-boot -boot-load-size 4 -boot-info-table -N -J -r \-c boot.catalog -hide boot.catalog -hide-joliet boot.catalog CDROOT
```

You should now have an a file called **dos.iso** created in the working directory. Here my output screen of a successful ISO creation:

```
macky@maru-lx:~/Documents/bootable-dos/FDOEMCD$ mkisofs -o dos.iso -b isolinux/isolinux.bin -no-emul-boot -boot-load-size 4 -boot-info-table -N -J -r \-c boot.catalog -hide boot.catalog -hide-joliet boot.catalog CDROOT
Warning: creating filesystem that does not conform to ISO-9660.
I: -input-charset not specified, using utf-8 (detected in locale settings)
Size of boot image is 4 sectors -> No emulation
Total translation table size: 2048
Total rockridge attributes bytes: 1127
Total directory bytes: 2048
Path table size(bytes): 26
Max brk space used 0
388 extents written (0 MB)

```

Now that the ISO has been created, time to test this before I start playing with some real hardware. I have VMware Workstation 10 installed on my laptop, so lets mount the ISO to make sure I boot into a DOS environment.

I created a VM without installing an OS so and mount the ISO with the CD drive. Once you power on, you should be dropped into a blue screen prompting to boot.

[![dos-boot](/wp-content/uploads/2015/01/dos-boot.png)](/wp-content/uploads/2015/01/dos-boot.png)

Either wait 15 seconds or hit enter to see the DOS CLI

[![dos](/wp-content/uploads/2015/01/dos.png)](/wp-content/uploads/2015/01/dos.png)

Remember, you can drop your \*.exe files in CDROOT and run the mkisofs command again to create a new image. Now you can mount it via virtual CDROM and upgrade stuff.
