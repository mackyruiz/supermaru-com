---
title: "Enabling VNC for ESXi"
pubDate: "2017-07-18T14:44:48-07:00"
description: "Sometimes in home lab environments you don’t have access to resources like vCenter to look at the guest VM status via console. Fortunately, you can modify ESX"
categories: ["data-center","data-center/vmware/esxi","tips-and-tricks","data-center/vmware","data-center/vmware/vsphere"]
tags: ["administration","cli","esxcli","firewall","guest-vm","networking","virtualization","vmware","vmx","vnc"]
urlPath: "2017/07/enabling-vnc-esxi"
wpId: 458
---

Sometimes in home lab environments you don’t have access to resources like vCenter to look at the guest VM status via console. Fortunately, you can modify ESX to enable VNC to a guest VM and use any computer to get KVM access.

### Pre-requisites:

1.  Network connectivity from your client to the ESXi host
2.  Root SSH access to the ESXi server
3.  Any VNC client

### Modifying your ESX server

You’d want to SSH over to the ESX server. You’ll need to make some permission changes on /etc/vmware/firewall/service.xml by running:

```
chmod 644 /etc/vmware/firewall/service.xml
```

```
chmod +t /etc/vmware/firewall/service.xml
```

Once those changes are in, edit service.xml to add VNC to the firewall configuration in the bottom of the configuration, but just right above </ConfigRoot>

```
<service id='new unique id within this file'>
<id>VNC</id>
   <rule id='0000'>
   <direction>inbound</direction>
   <protocol>tcp</protocol>
   <porttype>dst</porttype>
   <port>
     <begin>5900</begin>
     <end>6199</end>
   </port>
</rule>
</service>
```

You will need to update the ESX firewall policy by running:

```
esxcli network firewall refresh
```

And then enable VNC:

```
esxcli network firewall ruleset set --ruleset-id VNC --enabled true
```

Then to check if its running and that the ports 5900-6199 is open

```
[root@maru-esx:~] esxcli network firewall ruleset list
Name Enabled
------------------------ -------
..
VNC true
```

```
[root@maru-esx:~] esxcli network firewall ruleset rule list
Ruleset Direction Protocol Port Type Port Begin Port End
------------------------ --------- -------- --------- ---------- --------
..
VNC Inbound TCP Dst 5900 6199
```

Now, i’m assuming you don’t have access to vCenter or the vSphere think client, so you’ll need edit the guest VM’s .vmx file and add the following:

```
RemoteDisplay.vnc.enabled = "TRUE"
RemoteDisplay.vnc.port = "5901"
```

Note: Since you are editing the .vmx file, you MUST power-off the guest VM and unregister it. Then re-register and power on.

First you need to find out the Vmid by running. In the example below, my guest VMid is 5

```
[root@maru-esx:~] vim-cmd vmsvc/getallvms
Vmid Name File Guest OS Version Annotation
5 macky-vc [datastore1] macky-vc/macky-vc.vmx sles11_64Guest vmx-08 VMware vCenter Server Appliance
```

To power-off the guest VM:

```
[root@maru-esx:~] vim-cmd vmsvc/power.off 5
```

Unregistering the guest VM from ESXi:

```
[root@maru-esx:~] vim-cmd vmsvc/unregister 5
```

Re-registering the guest VM to ESXi:

```
[root@maru-esx:~] vim-cmd solo/register /vmfs/volumes/datastore1/macky-vc/*.vmx
```

Powering-on the guest VM:

```
[root@maru-esx:~] vim-cmd vmsvc/power.on 6
```

Now that the guest VM’s .vmx file has been configured, you can use any VNC client to open a connection:

![](/wp-content/uploads/2017/07/Screen-Shot-2017-07-18-at-2.18.09-PM.png) ![](/wp-content/uploads/2017/07/Screen-Shot-2017-07-18-at-2.20.40-PM.png)
