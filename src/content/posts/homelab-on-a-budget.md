---
title: "Homelab on a budget"
pubDate: "2025-08-16T16:06:56-07:00"
description: "What if I told you this 10-year-old laptop can run a full IT lab—web servers, VMs, a VPN, and even a Git server. I’m creating a series where its focused on"
categories: ["homelab"]
tags: ["linux"]
heroImage: "/wp-content/uploads/2025/08/Configuracion-KVM-Economica.png"
urlPath: "2025/08/homelab-on-a-budget"
wpId: 678
---

<iframe loading="lazy" title="Linux Home lab - budget edition" width="1200" height="675" src="https://www.youtube.com/embed/xLFdu7pYfKc?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen=""></iframe>

What if I told you this 10-year-old laptop can run a full IT lab—web servers, VMs, a VPN, and even a Git server.

I’m creating a series where its focused on building practical, budget-friendly home labs by using old laptops. We’ll install Linux and KVM on Linux. No expensive enterprise servers and a great WAF, or Wife Acceptance Factor.

Lets start with virtualization. We can install virtualbox, but why not something _faster_. Virtualbox will operate as a type 2 hypervisor while KVM will act as a type1. Its integrated in the linux kernel so the performance is much faster.

I am using Fedora Linux for this example since that is what I am currently running.

You want to install the virtualization package:

```
sudo dnf install @virtualization
```

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXeGO7HHPBXPsw6_2PZ2qhP0jgGm3JelUqDBctOApsmkq94D0nf-a7dv1PREDnQpMsjG1Xl9FLVUhKkvrOd2-JbSjANySY0fA3z-Wn4xOnVc6pYavhy2mngtd1xtAnA8haiviYd-Nw?key=BA20n3iTlaa5q-TRyJ2Blg)

Start services:

```
sudo systemctl start libvirtd
```

Enable on boot:

```
sudo systemctl enable libvirtd
```

Check on Networking:

```
macky@tatooine:~$ virsh net-list --all
 Name   State   Autostart   Persistent
----------------------------------------
```

Notice how there are no networks listed. Lets use the default from /`usr/share/libvirt/networks/default.xml`

```
<network>
  <name>default</name>
  <bridge name='virbr0'/>
  <forward/>
  <ip address='192.168.122.1' netmask='255.255.255.0'>
    <dhcp>
      <range start='192.168.122.2' end='192.168.122.254'/>
    </dhcp>
  </ip>
</network>
```

Now we need to reference that file from /usr/share/libvirt/networks/default.xml:

```
virsh net-define /usr/share/libvirt/networks/default.xml
```

Network default marked as auto started

```
virsh net-autostart default
```

Then use the default network:

```
virsh net-start default
```

```
virsh net-list --all

 Name      State      Autostart   Persistent

----------------------------------------------

 default   inactive   yes         yes
```

```
$ brctl show

bridge name bridge id STP enabled interfaces

virbr0 8000.525400864c1d yes 
```

Virtual machine manager:

![](https://lh7-rt.googleusercontent.com/docsz/AD_4nXfx8IzwWDjpu96oHQP5lhQzczWq7_7fGfQcrktJdEWIukUOhdYBk-NMiKDZ-P22Y0pUAmDhDufyiLxNt4m98b-H7pfDje2Pcx6iKNpF8PPBSMxvRBbDQzAaF4S2Ssk-SP0uKhwL?key=BA20n3iTlaa5q-TRyJ2Blg)

Ref: [https://docs.fedoraproject.org/en-US/quick-docs/virtualization-getting-started/](https://docs.fedoraproject.org/en-US/quick-docs/virtualization-getting-started/)
