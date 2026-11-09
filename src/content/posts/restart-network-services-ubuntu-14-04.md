---
title: "Restart network services in Ubuntu 14.04"
pubDate: "2014-09-25T03:01:01-07:00"
description: "One of my colleagues had deployed an Ubuntu 14.04 (desktop) VM to run as his infrastructure VM. When everything has been set and done in his sandbox"
categories: ["linux","tips-and-tricks"]
tags: ["cli","networking","ubuntu"]
urlPath: "2014/09/restart-network-services-ubuntu-14-04"
wpId: 179
---

One of my colleagues had deployed an Ubuntu 14.04 (desktop) VM to run as his infrastructure VM. When everything has been set and done in his sandbox environment, for some reason he could not set his static IP address.

I’ve verified that the static IP config is set properly in `/etc/network/interfaces` to make sure we do not have a issue. I tried `/etc/init.d/networking restart` , `service networking stop/start` , and `ifconfig eth0 down && ifconfig eth0 up.` All does nothing to set the static IP…

I figured I’d run the command in verbose mode… just to see whats going on:

```
 root@ubuntu:/home/macky# bash -x /usr/bin/service networking stop
++ basename /usr/bin/service
+ VERSION='service ver. 0.91-ubuntu1'
++ basename /usr/bin/service
+ USAGE='Usage: service < option > | --status-all | [ service_name [ command | --full-restart ] ]'
+ SERVICE=
+ ACTION=
+ SERVICEDIR=/etc/init.d
+ OPTIONS=
+ '[' 2 -eq 0 ']'
+ cd /
+ '[' 2 -gt 0 ']'
+ case "${1}" in
+ '[' -z '' -a 2 -eq 1 -a networking = --status-all ']'
+ '[' 2 -eq 2 -a stop = --full-restart ']'
+ '[' -z '' ']'
+ SERVICE=networking
+ shift
+ '[' 1 -gt 0 ']'
+ case "${1}" in
+ '[' -z networking -a 1 -eq 1 -a stop = --status-all ']'
+ '[' 1 -eq 2 -a '' = --full-restart ']'
+ '[' -z networking ']'
+ '[' -z '' ']'
+ ACTION=stop
+ shift
+ '[' 0 -gt 0 ']'
+ '[' -r /etc/init/networking.conf ']'
+ which initctl
+ grep -q upstart
+ initctl version
+ case "${ACTION}" in
+ exec stop networking
stop: Unknown job: networking
root@ubuntu:/home/macky# echo $?
1
```

Looking through, it should have stopped and restarted since it exited with a 1. Apparently this has been a bad/unsupported way to restart the network – just so happens Ubuntu decided to stop supporting this feature ([Ubuntu bug 1301015](https://bugs.launchpad.net/ubuntu/+source/ifupdown/+bug/1301015)).

Going through some Ubuntu forums, i found that `sudo service network-manager restart` works.

```
root@ubuntu:/home/macky# service network-manager restart
stop: Unknown job: network-manager
start: Unknown job: network-manager
root@ubuntu:/home/macky# sudo service network-manager restart
network-manager stop/waiting
network-manager start/running, process 3399
```

Interestingly enough even though I was root, I still had to run it as sudo. Oh well, just another thing to remember when I’m on 14.04 hosts.
