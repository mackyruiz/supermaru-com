---
title: "Linux tool: mssh"
pubDate: "2014-09-03T23:17:18-07:00"
description: "Are you a constantly managing multiple Linux nodes and doing a lot of copy/paste to 6+ terminal sessions? Wish you can just type and execute commands once and"
categories: ["tips-and-tricks","uncategorized"]
tags: ["cli","linux","mssh","ubuntu"]
urlPath: "2014/09/linux-tool-mssh"
wpId: 52
---

Are you a constantly managing multiple Linux nodes and doing a lot of copy/paste to 6+ terminal sessions? Wish you can just type and execute commands once and all your SSH windows get auto-magically filled? Enter: [mssh](http://mssh.sourceforge.net/).

### **What is it?**

This tool connects to multiple servers and opens them up into one terminal window. You type out a command once and it executes it on all sub-windows your connected to. If you need to work on one specific system, click on that session and the terminal will work independently. This is very useful tool if you are doing a lot of repetitive work on multiple systems.

### **Installation**

Ubuntu 12.04: Open a terminal session and type “**sudo apt-get install mssh**”

### **Examples**

I have two linux VMs I’d like to connect to and check our configurations: macky-vm1 and carlo-vm1 From the terminal, I’ll run run **mssh macky-vm1 carlo-vm1** ![mssh3](/wp-content/uploads/2014/08/mssh3.png)

_Note:_ this also works for IPs. For example macky-vm1 is 192.168.1.10 and carlo-vm1 is 192.168.1.11. You can do **mssh 192.168.1.10 192.168.1.11**

Alternatively if you have you can save yourself by typing less like so: **mssh 192.168.1.1{0,1}** You can even run mssh on a single host and get multiple sessions.  Here is an example of me running a dd command to my VM, and running dstat to monitor disk and network activity. [![mssh6](/wp-content/uploads/2014/08/mssh6.png)](/wp-content/uploads/2014/08/mssh6.png)

Most mssh sessions I can really see myself using on my 23″ monitor is up to 14-16, depending on the application. Maybe if you have a 32″+ or a 4k monitor you can run even more.

I have yet to find a mssh utility for Windows. I’ve  installed it on Fedora and CentOS and even seen my colleagues install an equivalent on OSX.
