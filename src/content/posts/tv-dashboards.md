---
title: "TV dashboards"
pubDate: "2017-02-23T19:27:45-08:00"
description: "I have a wall-mounted TV in the office where I want to show dashboards of different metrics. Cluster status, Nagios, network bandwidth, uptime, etc. They are"
categories: ["uncategorized"]
urlPath: "2017/02/tv-dashboards"
wpId: 61
---

I have a wall-mounted TV in the office where I want to show dashboards of different metrics. Cluster status, Nagios, network bandwidth, uptime, etc. They are all web-based and can be opened via web browser. I used Google Chrome and hit F11 to enter full screen mode to display my graphics.

![](/wp-content/uploads/2017/02/IMG_7639-1-1024x768.jpg)

Since I have multiple tabs open, i use [TabCarousel](https://chrome.google.com/webstore/detail/tabcarousel/ddldimidiliclngjipajmjjiakhbcohn?hl=en), a Chrome extension to cycle through the multiple tabs opened on my browser.

The hardware used to run the display is an [Intel Compute stick](https://www.amazon.com/Intel-Compute-Computer-processor-BOXSTK1AW32SCR/dp/B01ASB0DJ8), which can get picked up for $150. Think Google Chromecast, but it runs an embedded Windows 10 OS with the full Desktop Experience. Only problem i’ve had was the Windows 10 auto updates, which was disabled. Set Win10 to automatically start Chrome and have the browser open your sites thats needed to display, then you are good to go.

I went with the Intel Compute Stick based on my requirements:

1.  Needs to be a small form factor
2.  Needs to connect to my wireless network. Running 4 new ethernet cables to my IDF is not worth it.
3.   Needs a HDMI port

![](/wp-content/uploads/2017/02/IMG_7640-300x225.jpg)

Now your requirement can be different. I’ve experimented with multiple devices, and here is my feedback:

**Chromecast**

Pros:  
Really cheap!

Cons:  
Tab casting from the browser is slow (Still in Beta). You need a dedicated laptop or desktop to stay constantly online to display

**Apple TV**

Pros:  
Can do possible more than a Chrome Cast. Plenty of Apps.

Cons:  
Only can use Apple products to mirror displays. Too expensive to have a spare Mac just for this purpose.

**Rasberry Pi**

Pros:  
Cheap, small, runs a Linux OS. Can even VNC to it for maintenance.

Cons:  
Running a web browser immediately sucked up most of my memory resources. I was only able to run the dashboard slideshow for roughly 15 minutes before the browser crashes.

**Intel NUC**

Pros:  
Full blown computer in a really small form factor

Cons:  
Costly based on your configuration and specs are overkill. Size is also a problem for wall-mounted TVs.
