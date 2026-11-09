---
title: "Ethical Hacking Final – Fall 2018 (Mission College)"
pubDate: "2018-12-10T15:59:47-08:00"
description: "For my final project in my ethical hacking course (CIT016 at Mission College), we had to create a 7 minute video demonstrating a vulnerability with Kali Linux."
categories: ["networking","security","networking/wireless"]
tags: ["aircrack-ng","cit016","mission-college","security","vulnerability","wireless","wpa2"]
urlPath: "2018/12/ethical-hacking-final-fall-2018-mission-college"
wpId: 563
---

For my final project in my ethical hacking course (CIT016 at Mission College), we had to create a 7 minute video demonstrating a vulnerability with Kali Linux. I’ve decided to showcase a vulnerability of WPA2 by cracking the hashed password and ultimately logging into the wireless network. 

<iframe loading="lazy" title="Hacking WPA2" width="1200" height="675" src="https://www.youtube.com/embed/H7fJh5Tzbb0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>

### In order to crack WPA2, you will need to do the following: 

1\. Capturing a 4-way handshake  
2\. Crack the 4-way handshake  

In a nutshell, the password cracking by checking the MIC in the 4th frame. The Message Integrity Check (MIC) verification is how the Access Point (AP) checks the validity of the Pairwise Transient Key) PTK, which is where the password happens to be.   

### Capturing the 4-way handshake:

This is obtainable by using a wireless card that is capable of packet injection. You would need to put your wireless card into monitor mode to sniff the airwaves around you and then target the BSSID once you find the ESSID that is being advertised.

To put your card into monitoring mode, you will need to run:

```
airmon-ng start [interface name]
```

To sniff the airwaves around you, you will need to run:

```
airodump-ng wlan0mon
```

This will list all of the SSIDs, Channel information, encryption method and MAC address of the APs. Once you have found the network you want to attack, you want to narrow your search on that specific SSID by providing: Channel and MAC address of the AP. You would also want to do a packet capture and write it out to a file like so:

```
airodump-ng -c 10 --bssid [MAC ADDRESS] -w path-to-file wlan0mon
```

Keep the command above running and on another window, you’d want to force the client(s) to re-connect to the network by doing a deauth attack. This is done by running:

```
aireplay-ng -0 5 -a [SSID] -c [Client MAC Address] wlan0mon
```

You know you are succesfull if the other window shows the WPA handshake on the top right.

### Cracking the 4-way handshake

Now that you have done the first step of the pre-requisites of cracking WPA2, you will need to crack the password.

You should now have a \*.cap file of the packet capture and ready to crack the password. In my video example, I used a password list from here: [https://github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists)

Now that you have both \*.cap and password list files, you can use aircrack-ng to crack the hash:

```
aircrack-ng -w [path to password list.txt] -b [SSID MAC] [path to *.cap]
```

If the password is in the password list, you should be able to crack it. The pros and con of cracking WPA2 is that you can take the files offline and use a more powerful computer or server to work through all of the password lists. 

**Lab details:**

– Router: TP-link TL-WR841N-  
– Wireless Client: Lenovo laptop  
– Attacker: Kali Linux as a VM in VMware Workstation, hosted on another laptop.-  
Wireless card: [Alfa Network AWUS036NHA](https://www.amazon.com/Alfa-AWUS036NHA-Wireless-USB-Adaptor/dp/B004Y6MIXS)
