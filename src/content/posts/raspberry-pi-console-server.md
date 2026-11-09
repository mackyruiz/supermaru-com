---
title: "Raspberry pi Console Server"
pubDate: "2015-05-06T23:54:57-07:00"
description: "Do you work with networking devices but don’t have the money to shell out for a Opengear, Pele, or Tripplite serial console server? Fear not, Raspberry Pi is"
categories: ["data-center","linux","homelab/raspberry-pi","tips-and-tricks"]
tags: ["console","networking","raspberry-pi","serial","telnet"]
urlPath: "2015/05/raspberry-pi-console-server"
wpId: 262
---

Do you work with networking devices but don’t have the money to shell out for a Opengear, Pele, or Tripplite serial console server? Fear not, Raspberry Pi is here! Home lab users and budget constrained Network Admins will enjoy this.

For those who are unfamiliar with the [Raspberry Pi](https://www.raspberrypi.org/help/faqs/) (RPi for short), its a credit card sized computer that runs Linux. Your imagination is the only limitation.

### Using the Raspberry Pi

Because the RPi runs linux, we’ll use a program called [ser2net](http://ser2net.sourceforge.net/). This allows us to take a network configuration and pass it over to a serial connection. The RPi 2 has a total of four USB ports, so we can squeeze in a total of 16 serial ports if we want to by using the USB to 4xDB9 adapters. If you use the RPi Model A, you are limited to just two USB ports.

If you really want the ports, you can use a USB hub and go bananas with the serial connections. Just keep in mind you’ll need additional power to drive the USB hub.

### Bill Of Materials:

<table border="1"><tbody><tr><td><strong>Item</strong></td><td><strong>Qty</strong></td><td><strong>Price</strong></td></tr><tr><td><a href="http://www.newark.com/raspberry-pi/raspberrypi-2-modb-1gb/sbc-raspberry-pi-2-model-b-1gb/dp/38Y6467?mckv=sWO1T1IOu|pcrid|57087234981|plid|?gross_price=">Raspberry Pi</a></td><td>1</td><td>$35</td></tr><tr><td><a href="http://www.amazon.com/Raspberry-Case-Black-New-Version/dp/B00UW2G1BS/ref=pd_sim_pc_26?ie=UTF8&amp;refRID=0GVEGWHN7ADRJNV2C2XZ">RPi Case</a></td><td>1</td><td>$10</td></tr><tr><td><a href="http://www.amazon.com/SanDisk-Memory-Frustration-Free-Packaging--SDSDQ-016G-AFFP/dp/B007KFXIDO/ref=sr_1_7?s=pc&amp;ie=UTF8&amp;qid=1430976660&amp;sr=1-7&amp;keywords=micro+sd+card">Micro SD Card, 8GB</a></td><td>1</td><td>$10</td></tr><tr><td><a href="http://www.amazon.com/Raspberry-SlimTalk-CarbonPak-L240XL60X-Universal/dp/B00M2F07B8/ref=sr_1_4?s=electronics&amp;ie=UTF8&amp;qid=1430976734&amp;sr=1-4&amp;keywords=microusb+power">Power</a></td><td>1</td><td>$8</td></tr><tr><td><a href="http://www.amazon.com/GearMo%C2%AE-36inch-Windows-Certified-Drivers/dp/B004ETDC8K/ref=sr_1_1?s=electronics&amp;ie=UTF8&amp;qid=1430976843&amp;sr=1-1&amp;keywords=usb+to+4+serial">USB To 4 Serial connectors</a></td><td>1-4</td><td>$45 ea</td></tr></tbody></table>

**Total for just 4xDB9: ~$108**

You can pimp out your RPi with 16 ports for about $240.

![IMG\_3961](/wp-content/uploads/2015/05/IMG_3961-768x1024.jpg)

### Setup:

I have my RPi 2 running Raspian, which is a Debian distro with a 3.18 kernel.

### Installing ser2net

```
wget http://downloads.sourceforge.net/project/ser2net/ser2net/ser2net-2.9.1.tar.gz
 tar -xzvf ser2net-2.9.1.tar.gz
 cd ser2net-2.9.1/
 ./configure
 make
 sudo make install
 make clean

```

### Identifying USB -> TTY mapping.

Since I have two of the USB adapters, I see a total of eight TTY lines. You’ll want to run _dmesg | grep tty_

```
root@peach-pi:~# dmesg | grep tty
<output ommited>
[ 4.279028] usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB0
[ 4.376444] usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB1
[ 4.480113] usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB2
[ 4.599098] usb 1-1.2: FTDI USB Serial Device converter now attached to ttyUSB3
[ 4.665776] usb 1-1.3: FTDI USB Serial Device converter now attached to ttyUSB4
[ 4.724553] usb 1-1.3: FTDI USB Serial Device converter now attached to ttyUSB5
[ 4.764607] usb 1-1.3: FTDI USB Serial Device converter now attached to ttyUSB6
[ 4.795576] usb 1-1.3: FTDI USB Serial Device converter now attached to ttyUSB7
```

Looking at the output above, usb 1-1.2 has a total of four tty lines mapping to ttyUSB0-3. The second USB port, 1-1.3 takes ttyUSB4-7. If you decide to use all eight ports, usb 1-1.4 and usb 1-1.5 will show up.

![IMG\_3962](/wp-content/uploads/2015/05/IMG_3962-768x1024.jpg)

With the cables I have purchased, the port numbers are molded onto the connector (1-4). Since I’m using two of these, the second USB serial cable #1 becomes ttyUSB4, #2 becomes ttyUSB5, and so on. I’ve used a [cable label maker](http://www.amazon.com/Brady-BMP21-PLUS-Handheld-Printer-Multi-Line/dp/B00IELD1O4/ref=sr_1_1?ie=UTF8&qid=1430980548&sr=8-1&keywords=brady+bmp21) to make life easier and quickly see what cable is mapped to what TCP port number.

### Setting up the port forwarding

Now we know how Linux mapped our USB Ports to the tty lines, lets set the port forwarding by editing /etc/ser2net.conf

Here is my config file:

```
 root@peach-pi:~# cat /etc/ser2net.conf
 BANNER:banner:Macky's Raspberry Pi console server. All connections are monitored and logged. V VATCHING U
 1001:telnet:0:/dev/ttyUSB0:9600 8DATABITS NONE 1STOPBIT banner
 1002:telnet:0:/dev/ttyUSB1:9600 8DATABITS NONE 1STOPBIT banner
 1003:telnet:0:/dev/ttyUSB2:9600 8DATABITS NONE 1STOPBIT banner
 1004:telnet:0:/dev/ttyUSB3:9600 8DATABITS NONE 1STOPBIT banner
 1005:telnet:0:/dev/ttyUSB4:9600 8DATABITS NONE 1STOPBIT banner
 1006:telnet:0:/dev/ttyUSB5:9600 8DATABITS NONE 1STOPBIT banner
 1007:telnet:0:/dev/ttyUSB6:9600 8DATABITS NONE 1STOPBIT banner
 1008:telnet:0:/dev/ttyUSB7:9600 8DATABITS NONE 1STOPBIT banner
```

Whoa there, what the heck is all that?! Lets break it down:

BANNER – this is your motd (message of the day) when you connect to the terminal server. You don’t need it, but its a nice to have.

Setting up the port forwarding:

```
1001:telnet:0:/dev/ttyUSB0:9600 8DATABITS NONE 1STOPBIT banner
```

The configuration is broken down like so: <port number>:telnet:<state>:<device>:<options>.  So in my example above, I’m taking TCP port 1001 and forwarding it to /dev/ttyUSB0, using 9600 baud rate, 9 DATA bits, no parity, 1 stop bit, and display the banner.

Testing it all out

```
root@macky-vm1:~# telnet peach-pi 1001
Trying 10.X.X.X...
Connected to peach-pi.eng.storvisor.com.
Escape character is '^]'.
Macky's Raspberry Pi console server. All connections are monitored and logged. V VATCHING U
```

![IMG\_3963](/wp-content/uploads/2015/05/IMG_3963-768x1024.jpg)

I have a couple improvements I’d like to do for my RPi terminal server such as having power via POE Ethernet and maybe utilizing the GPIO pins by adding temperature sensors to monitor the hot and cold aisles, or an airflow sensor to see if the AC supply is dumping air or not. Since its running linux, we can run more open source applications and add alerting.
