---
title: "Discovering VMware ESX servers"
pubDate: "2015-04-03T11:39:00-07:00"
description: "My colleague Ashish Hanwadikar wrote a quick post on Linkedin on discovering ESX servers in the same subnet. Here is the post: “VMware ESX servers have SLP"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware"]
tags: ["cli","networking","security"]
urlPath: "2015/04/discovering-vmware-esx-servers"
wpId: 253
---

My colleague Ashish Hanwadikar wrote a quick post on Linkedin on discovering ESX servers in the same subnet. Here is the post:

“VMware ESX servers have SLP (Service Discovery Protocol) enabled by default making it easy to discover all ESX servers in a given subnet through any SLP client. For example, on linux, running the following will list all the ESX servers in the current subnet:

> ~$ slptool findsrvs VMwareInfrastructure  
> service:VMwareInfrastructure://esxhost101.mydatacenter.com,65535  
> service:VMwareInfrastructure://localhost.localdomain,65535

You will need to have multicast enabled in the subnet.

You can also get additional details, such as BIOS UUID and version:

> slptool findattrs service:VMwareInfrastructure://esxhost101.mydatacenter.com

> (product=”VMware ESXi 5.5.0 build-2068190″),(hardwareUuid=”511854B6-F07F-E311-B547-001E67A945C5″)”

Source: [https://www.linkedin.com/pulse/discovering-vmware-esx-servers-ashish-hanwadikar](https://www.linkedin.com/pulse/discovering-vmware-esx-servers-ashish-hanwadikar)
