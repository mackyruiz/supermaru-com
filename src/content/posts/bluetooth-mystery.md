---
title: "Bluetooth mystery"
pubDate: "2017-03-06T18:38:40-08:00"
description: "For quite some time i’ve been told that peoples bluetooth Mac keyboard and mouse gets disconnected intermittently. I’ve done the usual, make sure the battery is"
categories: ["uncategorized"]
urlPath: "2017/03/bluetooth-mystery"
wpId: 366
---

For quite some time i’ve been told that peoples bluetooth Mac keyboard and mouse gets disconnected intermittently. I’ve done the usual, make sure the battery is good, [reset the PRAM](http://www.macworld.com/article/2881177/how-to-reset-your-macs-nvram-pram-and-smc.html), [Reset the Bluetooth adapter via the hidden menu](http://osxdaily.com/2015/12/15/reset-bluetooth-hardware-module-mac-osx/), but no luck. We kind of brushed it off as there is too many Macs in the office or its a Mac keyboard/mouse problem, but that just not make sense… How does a larger company with an entire building of people running around with these devices not cause chaos? You figure you’d hear about it online with the PC fanboys trashing Mac users.

Then one day someone yelled out “Hey Macky, why is your Mac connected to mine via Bluetooth!?” And sure enough, via Bluetooth hidden menu I saw this:

![](/wp-content/uploads/2017/01/Screen-Shot-2017-01-10-at-16.35.53-278x300.png)

Someones device, a Macbook pro and a random bluetooth device… All connected to me. At one point I saw 3 iphones, two Macbooks and an apple watch. I felt like I can do so much damage, but I’d hate for that karma to come around later… After a resetting MY Bluetooth adapter, updating Mac updates, rebooting, resetting PRAM, I still was connecting to other peoples devices. The freaky part is I could send or receive data to each device. A hackers wet dream.

After googling “My Mac is connecting to anything over bluetooth”, I eventually stumbled across this forum: http://apple.stackexchange.com/questions/175425/my-colleagues-imac-connects-to-my-macbook-pro-via-bluetooth-without-my-consent

After a quick skim through, one thing stuck out to me: [MacID](https://macid.co/).

Once I removed MacID, the problem seemed to have vanished. No more phantom devices connecting to me… for now.
