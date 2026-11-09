---
title: "Windows Subsystem for Linux – Ubuntu GUI with xfce"
pubDate: "2018-09-08T13:35:06-07:00"
description: "I’ve finally moved on from my Macbook Pro, late 2013 model and onto a Dell XPS13. I have a work-issued MBP with the touch-bar gimmick and absolutely dislike the"
categories: ["tips-and-tricks","uncategorized"]
tags: ["linux","tips-and-tricks","ubuntu","windows","wsl"]
urlPath: "2018/09/windows-subsystem-for-linux-ubuntu-gui-with-xfce"
wpId: 531
---

I’ve finally moved on from my Macbook Pro, late 2013 model and onto a Dell XPS13. I have a work-issued MBP with the touch-bar gimmick and absolutely dislike the keyboard. I decided to dual boot the device with Ubuntu 18.04 but what to do so many workarounds due to the NVMe disk in my XPS13 that made switching between OS inconvenient. I _was_ going to wipe the Windows partition and run it as a VM until I updated the USBC firmware then something happened: my GRUB menu vanished and it booted straight to Windows.

Out of pure laziness I decided to try Windows 10 out and the new Windows Subsystem for Linux (more info here: [https://docs.microsoft.com/en-us/windows/wsl/faq](https://docs.microsoft.com/en-us/windows/wsl/faq)). Much to my amazement, it does a lot of basic things. There are some things that do not work (tcpdump is one example), but I think overtime it improve. As I was searching on what I can and cannot do, I found this cool party trick: Getting a GUI for WSL.

### Pre-reqs:

1.  Internet connectivity to download packages and such
2.  A Windows 10 device
3.  Enable WSL and install Ubuntu – [https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
4.  Download a Windows X-server such as [VcXsrv (https://sourceforge.net/projects/vcxsrv/)](https://sourceforge.net/projects/vcxsrv/)

Once you get your Ubuntu instance running, you will need to install a desktop environment. In this case, its xfce.  We will also need to tell Ubuntu where to display xfce.

### Ubuntu setup:

To install xfce, you will need to run: `sudo apt install xfce4`

And to tell Ubuntu where to display xfce, run: `sudo echo "export DISPLAY=:0.0" >> ~/.bashrc`

### Windows setup:

Install VcXsrv and run XLaunch.

![](/wp-content/uploads/2018/09/wsl1.png)

_I select “One window without titlebar”_

![](/wp-content/uploads/2018/09/wsl2.png)

_I leave with default settings as shown here_

![](/wp-content/uploads/2018/09/wsl3.png)

_I check “Disable access control”_

![](/wp-content/uploads/2018/09/wsl4.png)

Don’t be scared when you just see a blank screen. You can do a `ALT + TAB` back to your Bash terminal and run: `xfce4-session` and watch the magic happen. Now you have a Linux system without running a VM!

![](/wp-content/uploads/2018/09/wsl5-1024x576.png)

### My personal preferences:

1.  I hide my Windows task bar. Just hit the Windows key, type “Windows task bar” and select “Automatically hide the taskbar in desktop mode”
2.  I run the X-server in a different virtual desktop. You can do this by pressing the `CTRL + WIN + D` to start new desktop. You can also use the `CTRL + WIN + LEFT/RIGHT` arrow keys to switch between.
    1.  Here is a view of my virtual desktops: ![](/wp-content/uploads/2018/09/wsl6.png)
3.  In xfce, I noticed Windows takes precedence for key combinations such as `ALT + TAB`. I made `CTRL + TAB` my combination to switch applications for Linux

### Post installation:

I would like to try and get the following going:

1.  A one-liner script to open a new virtual desktop, start Xlaunch and start xfce
2.  Try to get GNOME working since at the time of this writing, the version you get on the Microsoft store is 18.04.1 LTS

For now, i’ll try running some of my daily-use programs with WSL. I’m also quite glad that I’m not eating up too many hardware resources. I’m currently at 37% CPU and 50% memory (my biggest resource hog is Google Chrome). This leaves me with plenty of space to spin up a VM if I need to.
