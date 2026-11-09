---
title: "Speedtest-cli on Ubuntu"
pubDate: "2015-10-15T23:31:39-07:00"
description: "Speedtest.net is one of my de-facto go-to websites when doing a sanity check on my network for throughput. Unfortunately it requires the Adobe Flash Player"
categories: ["linux"]
tags: ["cli","linux","network-testing","networking","performance-testing","testing","ubuntu"]
urlPath: "2015/10/speedtest-cli-on-ubuntu"
wpId: 338
---

Speedtest.net is one of my de-facto go-to websites when doing a sanity check on my network for throughput. Unfortunately it requires the Adobe Flash Player plugin, so in certain circumstances its too much of a hassle to get Flash installed or poor graphics on a VM, etc.

So good thing is that there is a CLI option to run speedtest!

**Note**:

I don’t recommend solely relying on speedtest as your benchmark tool. There are others you can run through a browser like [Shoretel Sky’s VOIP test](http://voiptest.shoretelsky.com/main), which has a nice quick in-depth test on your circuit link consistency, jitter, latency, etc. I’d also recommend doing an FTP test to a known server to get your tests. There are also many other tools out there if you do a quick google-search, but speedtest is typically the first to come to mind for bandwitdh testing

## Getting started:

You’ll need pip in order to install speedtest-cli. If you don’t have it, go ahead and run:  
`sudo apt-get install python-pip`

Then:  
`sudo pip install speedtest-cli`

## Running speedtest-cli

If you just run “speedtest-cli” you instantly kick off a speed-test. It will automatically pick a server with the best latency and execute the test:

```
# speedtest-cli
Retrieving speedtest.net configuration...
Retrieving speedtest.net server list...
Testing from [My ISP] (1.2.3.4 IP adddress)...
Selecting best server based on latency...
Hosted by SoftLayer Technologies, Inc. (San Jose, CA) [1.46 km]: 17.049 ms
Testing download speed........................................
Download: 50.84 Mbit/s
Testing upload speed..................................................
Upload: 49.45 Mbit/s

```

**Using certain servers**

When debugging network issues, its good to stay consistent with test servers, so you can list out your options by running `speedtest-cli -list`

Once you pick a specific server by calling out its specific ID such as: speedtest-cli –server \[ID\]

```
root@macky-vm1:~# speedtest-cli --list
Retrieving speedtest.net configuration...
Retrieving speedtest.net server list...
4042) SoftLayer Technologies, Inc. (San Jose, CA, United States) [1.46 km]
5479) Sonic.net, Inc (San Jose, CA, United States) [4.18 km]
5086) Google Fiber (Palo Alto, Ca, United States) [26.62 km]
2761) SingTel (Palo Alto, CA, United States) [27.70 km]
1418) Fiber Internet Center LLC (Palo Alto, CA, United States) [27.70 km]
```

If I want to test with SoftLayer, ill go ahead and run: `speedtest-cli --server 4042`

```
root@macky-vm1:~# speedtest-cli --server 4042
Retrieving speedtest.net configuration...
Retrieving speedtest.net server list...
Testing from [My ISP] (1.2.3.4 IP adddress)...
Hosted by SoftLayer Technologies, Inc. (San Jose, CA) [1.46 km]: 16.227 ms
Testing download speed........................................
Download: 49.68 Mbit/s
Testing upload speed..................................................
Upload: 47.80 Mbit/s
```

Happy speed-testing
