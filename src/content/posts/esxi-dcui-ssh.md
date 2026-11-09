---
title: "ESXi DCUI over SSH"
pubDate: "2014-08-29T04:46:52-07:00"
description: "This is a cool thing I’ve found out: You can see the ESXi Direct Console User Interface (DCUI) via SSH! Normally you can see this yellow/gray console via"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware"]
tags: ["dcui","ssh","tips-and-tricks"]
urlPath: "2014/08/esxi-dcui-ssh"
wpId: 48
---

This is a cool thing I’ve found out: You can see the ESXi Direct Console User Interface (DCUI) via SSH! Normally you can see this yellow/gray console via  monitor into your physical ESXi host, connect via IPMI/iDRAC/iLO, or via console when running a nested ESXi VM. There is not much real practical use out of this if you are running this in a production environment since you should have some sort of remote management. Maybe if you are in too much of a rush to configure DNS via esxcli, open vSphere (C# client or web client),  or for training purposes.

**Here is how to do it:**

#### 1\. Enable SSH and ESXi Shell

You can do this two ways: physically or via vSphere client.

**Physical:**

-   Connect your monitor and keyboard
-   Go to Troubleshooting Options>Enable SSH

**vSphere client (Windows C#):**

-   Connect to your ESXi host and navigate over to: Configuration>Software>Security Profile>Services>Profiles
-   Select SSH and click “Options”
-   Select “Start and stop with host” under Startup Policy and Start.
-   Same steps for ESXi Shell

![cclient2](/wp-content/uploads/2014/08/cclient2-1024x412.png)

_vSphere Security Profile_

![cclient3](/wp-content/uploads/2014/08/cclient3.png)

_SSH service_

![cclient4](/wp-content/uploads/2014/08/cclient4.png)

_SSH started._

#### 2\.  Connect to your ESXi host via SSH.

Open a terminal (or putty for you Windows users) and SSH to your host.

One you are logged in, run “dcui”

![SSH](/wp-content/uploads/2014/08/cclient5.png)

_esxcli_

![ESXi DCUI configuration screen](/wp-content/uploads/2014/08/cclient8.png)

_ESXi DCUI configuration screen_

![ESXi DCUI console login](/wp-content/uploads/2014/08/cclient7.png)

_ESXi DCUI console login_

![Run "dcui"](/wp-content/uploads/2014/08/cclient6.png)

_Run “dcui”_

And there you have it: That familiar ESXi console screen! Have fun and impress your coworkers. To get out of dcui, just do a ctrl+c and that should drop you back to the esxcli.
