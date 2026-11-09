---
title: "Finding the vCenter server"
pubDate: "2016-10-11T01:58:52-07:00"
description: "Ever wondered how do you find out what vCenter server is managing (or if there is any) a ESXi host? I’ve struggled for a while since there is no way via command"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware","data-center/vmware/vsphere"]
tags: ["cli","console","vcenter","vmware"]
urlPath: "2016/10/finding-the-vcenter-server"
wpId: 345
---

Ever wondered how do you find out what vCenter server is managing (or if there is any) a ESXi host? I’ve struggled for a while since there is no way via command line to see this information. vim-cmd, esxcli or esxcfg commands show nothing. I normally resorted to my Windows VM, launch the vSphere C# client and login directly to the ESXi host and wait for this to popup:

![vCenter](/wp-content/uploads/2016/10/vCenter-1024x508.png)

Thankfully, there is a way to see this without jumping through some extra hoops. If you can SSH to your ESX server, the vCenter IP is in this configuration file: _/etc/vmware/vpxa/vpxa.cfg_, under the vpxa portion:

```
<vpxa>
 <bundleVersion>1000000</bundleVersion>
 <datastorePrincipal>root</datastorePrincipal>
 <hostIp>10.1.1.10</hostIp>
 <hostKey>[Your key here]</hostKey>
 <hostPort>443</hostPort>
 <licenseExpiryNotificationThreshold>15</licenseExpiryNotificationThreshold>
 <memoryCheckerTimeInSecs>30</memoryCheckerTimeInSecs>
 <serverIp>10.1.2.10</serverIp>
 <serverPort>902</serverPort>
 </vpxa>
```

**You can grep for it by doing:**

```
~ # cat /etc/vmware/vpxa/vpxa.cfg | grep serverI
 <serverIp>10.1.2.10</serverIp>
```

If you have a lab environment and you have standardized on a common login scheme, you can script this to make life easier. Here is my script that I have.

```
if [ "$#" -lt 1 ]; then
 echo "Enter remote_host and password"
 exit 1
fi
ssh-keygen -f "/root/.ssh/known_hosts" -R $i.yourdomain.com > /dev/null 2>&1
sshpas=`sshpass -p $2 ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no $1 cat /etc/vmware/vpxa/vpxa.cfg | grep serverIp`
VC=`echo $sshpas | tr -d '</>serverIp'`
NS=`nslookup $VC | grep name | awk '{print $4}'`
echo "$1 vCenter is: $NS ($VC) "
```

**Example**:

```
# ./find-vc.sh esx-001 password
Warning: Permanently added 'esx-001,10.1.1.10' (RSA) to the list of known hosts.
esx-001 vCenter is: esx-vc1.supermaru.com. (10.1.2.10)
```

Note: It only shows an IP address, and I do a reverse lookup on it against my DNS server. If there is nothing there, it hangs out in the nslookup prompt and i just hit control+c to get out like this:

```
./find-vc.sh esx-001 password
Warning: Permanently added 'esx-001,192.168.1.10' (RSA) to the list of known hosts.
>
> ^C
```

I also
