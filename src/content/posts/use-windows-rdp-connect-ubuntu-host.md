---
title: "Use Windows RDP to connect to a Ubuntu host"
pubDate: "2014-09-10T01:34:31-07:00"
description: "Here is a quick tutorial on how to use Windows Remote Desktop to a Ubuntu host. Ubuntu setup: Open a terminal window on your Ubuntu host and install xrdp:"
categories: ["linux"]
tags: ["rdp","ubuntu","windows"]
urlPath: "2014/09/use-windows-rdp-connect-ubuntu-host"
wpId: 164
---

Here is a quick tutorial on how to use Windows Remote Desktop to a Ubuntu host.

### Ubuntu setup:

Open a terminal window on your Ubuntu host and install xrdp:  
`apt-get install xrdp`

Lets set the RDP environment to use gnome  
`echo "gnome-session --session=ubuntu-2d" > ~/.xsession`

Change the permissions to make it executable  
`chmod 755 .xsession`

And finally, restart the xrdp service:  
`/etc/init.d/xrdp restart`

###  Connecting from Windows to Ubuntu:

Now that we have setup the ubuntu host, we can open Remote Desktop on your Windows host. Go ahead and type in the IP address or FQDN of the host. In my case, I’m going by IP address: 10.64.4.212.

![rdesktop1](/wp-content/uploads/2014/09/rdesktop1.png)

You Will be prompted with this window. I did the configuration as root, so I had provided my root credentials here.

[![rdesktop2](/wp-content/uploads/2014/09/rdesktop2-300x224.png)](/wp-content/uploads/2014/09/rdesktop2.png)

Once you have authenticated, your Ubuntu desktop should appear!

[![rdesktop3](/wp-content/uploads/2014/09/rdesktop3-300x168.png)](/wp-content/uploads/2014/09/rdesktop3.png)

If you are seeing a blank screen when you RDP (no menu bar) try making sure your .xsession file has been configured properly. If that does not help, try using this:  
`echo "gnome-session --session=gnome-fallback" > ~/.xsession`
