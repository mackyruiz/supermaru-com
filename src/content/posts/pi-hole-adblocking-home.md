---
title: "PI-HOLE: Adblocking for home"
pubDate: "2017-05-24T10:13:49-07:00"
description: "I’ve came across a yet another easy and cool home project that is intended for Rapsberry Pis, but can run on any flavor of Linux (Requirements here). Its called"
categories: ["homelab","linux","homelab/raspberry-pi"]
tags: ["linux","networking","security","ubuntu"]
heroImage: "/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-11.02.07-PM.png"
urlPath: "2017/05/pi-hole-adblocking-home"
wpId: 414
---

I’ve came across a yet another easy and cool home project that is intended for Rapsberry Pis, but can run on any flavor of Linux ([Requirements here](https://discourse.pi-hole.net/t/hardware-software-requirements/273)). Its called Pi-Hole and you can set it up in 5 minutes or less.

Website: [https://pi-hole.net/](https://pi-hole.net/)

The idea is simple: it blocks all add traffic in your network as it acts as a DNS server. While you _**should**_ have browser extensions to protect your privacy (a post for later), mobile devices, smart TVs, your mom’s laptop and your younger siblings computer full off questionable “free” software can benefit as they do not have to install or configure anything. Its all dynamically configured with some effort on the network level and the result is there is no user-level interaction required.

If you are familiar with OpenDNS, the service is similar with the following differences:

1.  You need to install PiHole locally in your network, then configuring your DNS server to send queries to PiHole versus setting the DNS server IP to OpenDNS
2.  PiHole takes care of blocking advertisements **_only_**
3.  OpenDNS does content filtering and protects you from malware, botnets, phishing and targeted online attacks

To get the best of both worlds,

1.  Configure your local LAN to resolve DNS queries to PiHole
2.  Configure PiHole to forward DNS queries to OpenDNS
3.  Use a firewall (pfsense works great)

### Installation

I’ll go over the basic installation on a Ubuntu 16.04 LTS server VM instead of a Raspberry Pi. The configuration would be the same, except I already have openssh-server, updates, etc setup on a VM that I’ve setup and treat as my template. I just simply did a link-clone in VMware Workstation and my environment was up in seconds.

Things you need to get started:

1.  Access to your DHCP server
2.  Provide a static IP address that is not within the range of your DHCP scope
3.  A Raspberry pi or Linux system (A VM would suffice for testing it out)

#### DHCP configuration

You will need to configure your DHCP server (if its home, then its most likely your router) so when a client requests for a DHCP IP, you can push the DNS IP address as well. I won’t touch on this configuration step as everyones home configuration would be different.

Once you have terminal access to your server, just type: `curl -sSL https://install.pi-hole.net | bash`

The installation process is straight forward and quick.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.55.01-PM.png)

Shortly after, a pink install dialogue will open:

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.52.27-PM.png)

Once the packages have loaded, you’ll be greeted with the automated installer message below. You will need to hit enter to proceed with the installation

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.05-PM.png)

Just like any open-source project, its free. However donations help and go a long way.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.12-PM.png)

A message will appear stating that you will need a static IP address (regardless if you have already done so)

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.18-PM.png)

This is where you can select your upstream DNS provider. Don’t worry, you can configure this later in the nice UI dashboard

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.29-PM.png)

Your next choice is to decide which protocol to select (IPv4 or IPv6, or both)

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.39-PM.png)

The installer will detect your IP address and ask if you really want to proceed. Go ahead and hit enter.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.46-PM.png)

One last warning stating the static IP address may be within a DHCP scope.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.53.56-PM.png)

Next menu is regarding the web admin interface. Leave as default and continue

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.54.11-PM.png)

Last item would be log queries. I left it default.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.54.19-PM.png)

Assuming your install went fine, you should see this final screen. Make note of your login password!

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.55.24-PM.png)

Once the install is done, open up a web browser and navigate to http://\[your ip address\]. You’ll need that password to proceed from here.

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-9.59.14-PM.png)

Once you are in, you are presented with a nice admin web dashboard:

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-10.43.53-PM.png)

I overwrote the DHCP assigned DNS server on my desktop with my PiHole server and started browsing the web. So far, it managed to block a couple advertisements already, regardless if i have AddBlock Plus

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-10.01.05-PM.png)

If you want to change the Pi-Hole configuration such as making it a DHCP server, changing the upstream DNS server, etc – its all do-able under Settings:

![](/wp-content/uploads/2017/05/Screen-Shot-2017-05-16-at-10.59.57-PM.png)

Now you’re all setup! Now start browsing websites and check back on the dashboard in 30 minutes. I guarantee how surprised you will be to see how much content you are filtering and how many things are working in the background on websites. Once cool idea is to run tcpdump (WireShark) and see how much calls to ad-related servers are going on before and after switching to PiHole.
