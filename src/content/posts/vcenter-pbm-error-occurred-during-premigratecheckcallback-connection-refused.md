---
title: "vCenter: “PBM error occurred during PreMigrateCheckCallback: Connection refused”"
pubDate: "2022-01-20T13:20:00-08:00"
description: "Encountered a new issue seen on a vCenter after we had a power outage: “PBM error occurred during PreMigrateCheckCallback: Connection refused. This error was"
categories: ["data-center/vmware"]
tags: ["vcenter"]
heroImage: "/wp-content/uploads/2022/01/vcsa-connection-refused.png"
urlPath: "2022/01/vcenter-pbm-error-occurred-during-premigratecheckcallback-connection-refused"
wpId: 652
---

[![](/wp-content/uploads/2022/01/Screen-Shot-2022-01-20-at-13.08.45-1024x94.png)](/wp-content/uploads/2022/01/Screen-Shot-2022-01-20-at-13.08.45.png)

Encountered a new issue seen on a vCenter after we had a power outage: “PBM error occurred during PreMigrateCheckCallback: Connection refused. This error was met when we tried cloning or creating a new VM in any of the hosts connected to the vCenter.

I fixed the issue by SSH’ing to the vCenter and dropping into a shell prompt:

```
➜ ~ ssh root@some-vcenter

VMware vCenter Server Appliance 6.7.0.46000

Type: vCenter Server with an embedded Platform Services Controller

root@some-vcenter's password:
Connected to service

    * List APIs: "help api list"
    * List Plugins: "help pi list"
    * Launch BASH: "shell"

Command> shell
Shell access is granted to root
```

I’ve verified that vmware-sps is not running and noticed that the service is masked when trying to restart it:

```
root@some-vcenter[ ~ ]# service vmware-sps status● vmware-sps.serviceLoaded: masked (/dev/null; bad)Active: inactive (dead)root@some-vcenter [ ~ ]# service vmware-sps startFailed to start vmware-sps.service: Unit vmware-sps.service is masked.root@some-vcenter [ ~ ]# service vmware-sps restartFailed to restart vmware-sps.service: Unit vmware-sps.service is masked.
```

If you go to /etc/systemd/system, you can see that the process is being linked to /dev/null:

```
root@some-vcenter [ /etc/systemd/system ]# ls -la | grep vmware-sps
lrwxrwxrwx  1 root root    9 Jan 12  2021 vmware-sps.service -> /dev/null
```

Now un-link it and restart services

```
root@some-vcenter [ /etc/systemd/system ]# systemctl unmask vmware-sps.service
Removed symlink /etc/systemd/system/vmware-sps.service.
```

```
root@some-vcenter[ /etc/systemd/system ]# service-control --start --all
Operation not cancellable. Please wait for it to finish…
Performing start operation on service lwsmd…
Successfully started service lwsmd
Performing start operation on service vmafdd…
Successfully started service vmafdd
Performing start operation on service vmdird…
Successfully started service vmdird
Performing start operation on service vmcad…
Successfully started service vmcad
Performing start operation on service vmware-sts-idmd…
Successfully started service vmware-sts-idmd
Performing start operation on service vmware-stsd…
Successfully started service vmware-stsd
Performing start operation on service vmdnsd…
Successfully started service vmdnsd
Performing start operation on profile: ALL…
Successfully started profile: ALL.
Performing start operation on service vmware-pod…
Successfully started service vmware-pod

root@some-vcenter [ /etc/systemd/system ]# service-control --status --all
Running:
applmgmt lwsmd pschealth vmafdd vmcad vmdird vmdnsd vmonapi vmware-analytics vmware-certificatemanagement vmware-cis-license vmware-cm vmware-content-library vmware-eam vmware-perfcharts vmware-pod vmware-postgres-archiver vmware-rhttpproxy vmware-sca vmware-sps vmware-statsmonitor vmware-sts-idmd vmware-stsd vmware-topologysvc vmware-updatemgr vmware-vapi-endpoint vmware-vmon vmware-vpostgres vmware-vpxd vmware-vpxd-svcs vmware-vsan-health vmware-vsm vsphere-client vsphere-ui
Stopped:
vmcam vmware-imagebuilder vmware-mbcs vmware-netdumper vmware-rbd-watchdog vmware-vcha vsan-dps
```

Now if you go back to the vCenter UI, you can do the normal VM creation or cloning operation.

**References:**

VMware doc on enabling SSH and bash access: [https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vcsa.doc/GUID-D58532F7-E48C-4BF2-87F9-99BA89BF659A.html](https://docs.vmware.com/en/VMware-vSphere/6.7/com.vmware.vsphere.vcsa.doc/GUID-D58532F7-E48C-4BF2-87F9-99BA89BF659A.html)

VMware KB article on stopping/restarting services: [https://kb.vmware.com/s/article/2109887](https://kb.vmware.com/s/article/2109887)

VMware KB articles regarding this issue: [https://kb.vmware.com/s/article/2118551](https://kb.vmware.com/s/article/2118551), [https://kb.vmware.com/s/article/2118557](https://kb.vmware.com/s/article/2118557)

VMware community page about unmasking a service: [https://communities.vmware.com/t5/vCenter-Server-Discussions/vCenter-6-5-vcenter-appliance-stops-working-out-of-the-blue/td-p/1417035](https://communities.vmware.com/t5/vCenter-Server-Discussions/vCenter-6-5-vcenter-appliance-stops-working-out-of-the-blue/td-p/1417035)

Article on how to unmask a service: [http://vmwareinsight.com/Articles/2020/8/5803068/How-to-start-a-service-which-is-masked-or-set-as-manual-mode-in-VCSA](http://vmwareinsight.com/Articles/2020/8/5803068/How-to-start-a-service-which-is-masked-or-set-as-manual-mode-in-VCSA)
