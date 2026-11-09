---
title: "Using RDP on a Ubuntu host"
pubDate: "2015-10-02T00:35:46-07:00"
description: "Here is a useful and quick one-liner command to get a RDP session from your Ubuntu system to a Windows host. Setup: Ubuntu 14.04 LTS VM Difficulty: Easy Setup"
categories: ["linux","tips-and-tricks"]
tags: ["cli","tips-and-tricks","ubuntu","windows"]
urlPath: "2015/10/using-rdp-on-a-ubuntu-host"
wpId: 296
---

Here is a useful and quick one-liner command to get a RDP session from your Ubuntu system to a Windows host.

Setup: Ubuntu 14.04 LTS VM  
Difficulty: Easy  
Setup time: <5 minutes  
You will have to install a program called rdesktop. Go ahead and run:

```
# sudo apt-get install -y rdesktop
```

Now that rdesktop is installed, you can quickly launch an Remote Desktop session from your Ubuntu CLI to a Windows host

```
# rdesktop (ip address or hostname)
```

```
example:
# rdesktop 10.64.1.50 &
```

Note: I use the ampersand & so I can keep the process running in the background and continue doing work on the CLI.

You can use numerous flags if you want to make login easier. Here are some flags I often use to access my Windows VM:

```
usage: rdesktop [options] server

-u: user name
-f: full screen mode
-g: geometry  (WxH) - If you want your RDP window larger than the default size
```

There are a lot more flags out there. Run the following for more info and options:

```
man rdesktop
```

or

```
rdesktop -h

```

![rdesktop-1](/wp-content/uploads/2015/10/rdesktop-1-1024x640.png)

_VM Inception. Using my Macbook to run a Linux VM via VMware Fusion, which then I RDP to my Windows VM on a ESXi host, which I regularly use to run the vSphere thick client to manage ESX hosts and the VMs inside it. Lost? Don’t worry, I get lost sometimes too._
