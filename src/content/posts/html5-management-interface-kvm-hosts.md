---
title: "HTML5 GUI management for KVM hosts"
pubDate: "2017-10-23T00:46:33-07:00"
description: "I came across this cool HTML5-based management interface for KVM hosts. Its called kimchi-project (https://github.com/kimchi-project/kimchi/). In this guide,"
categories: ["data-center","homelab","linux"]
tags: ["kvm","linux","ubuntu","virtualization"]
heroImage: "/wp-content/uploads/2017/10/kimchi-login.png"
urlPath: "2017/10/html5-management-interface-kvm-hosts"
wpId: 500
---

I came across this cool HTML5-based management interface for KVM hosts. Its called kimchi-project ([https://github.com/kimchi-project/kimchi/](https://github.com/kimchi-project/kimchi/)). In this guide, i’ll show you how to install it on an Ubuntu 16.04 host and manage your guest VMs.

### Pre-installation steps

If you haven’t installed quemu, go ahead and do that now.

```
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install qemu qemu-kvm libvirt-bin
```

### Downloading Kimchi

```
wget http://kimchi-project.github.io/wok/downloads/latest/wok.noarch.deb &&\
wget http://kimchi-project.github.io/gingerbase/downloads/latest/ginger-base.noarch.deb &&\
wget http://kimchi-project.github.io/kimchi/downloads/latest/kimchi.noarch.deb
```

### Installing Kimchi

Its best you follow the steps below in sequential order:

```
sudo dpkg -i wok-*.deb
sudo apt-get install -f
sudo service wokd start
sudo dpkg -i ginger-*.deb
sudo apt-get install -f
sudo service wokd restart
# reboot here
sudo reboot
sudo dpkg -i kimchi-*.deb
sudo apt-get install -f
#last reboot
sudo reboot
```

Once you have installed Kimchi, go ahead and open your favorite web browser and point it to: [https://127.0.0.1:8001](https://127.0.0.1:8001)

### Loging in

Kimchi uses PAM to authenticate, so you can use your default Linux login credentials at the login page

![](/wp-content/uploads/2017/10/kimchi-login.png)

Once you are in, you are defaulted to the Activity log.

### Creating a VM

First order of business, you will need to create a template. Head over to Virtualization > Templates > Add template

![](/wp-content/uploads/2017/10/kimchi-create-template-1024x799.png)

You can either pick a file path to your local ISO or pick any available ISO that Kimchi shows. I’ve kept mine local and created it there.

You can modify your template with the usual storage, network and CPU settings:

General settings covers basic information of the VM:

![](/wp-content/uploads/2017/10/kimchi-template-general-1024x506.png)

Storage options: You can add a directory, NFS, iSCSI, local or SCSI FC storage option

![](/wp-content/uploads/2017/10/kimchi-template-storage-1024x360.png)

Network options: You can create your usual isolate,d NAT, passthrough or bridged networking options. They also allow something called VEPA, which the VMs are connected to a VEPA-enabled switch

![](/wp-content/uploads/2017/10/kimchi-template-network-1024x346.png)

![](/wp-content/uploads/2017/10/kimchi-template-cpu-1024x491.png)

Once you got a basic template created, you can head over to Virtualization > Guests > Add guests

Your template that was created earlier will show up. Go ahead and click “create” to spawn off that VM

![](/wp-content/uploads/2017/10/kimchi-create-vm-1024x684.png)

### Managing your VMs

Once your VM has been created, you can click on the Actions drop down menu to do the usual VM operations such as view console, edit, migrate, stop/start/restart/nuke.

![](/wp-content/uploads/2017/10/kimchi-vm-overview-1024x216.png)  ![](/wp-content/uploads/2017/10/kimchi-vm-options.png)

KVM is also decent. It uses noVNC and doesn’t require any additional browser plugins.

![](/wp-content/uploads/2017/10/kimchi-guest-1024x712.png)

Snapshots can also be managed through Kimchi. Its hidden a couple more clicks away instead of being directly accessible on the Action drop down menu. You’ll need to go to Actions > Edit Guest > Snapshot:

![](/wp-content/uploads/2017/10/kimchi-snapshot-1024x644.png)

### Guest VM View

You have two options, the default AWS-ish view where you have the Guest ID name, OS Type, and VM stats called **Table View**.

![](/wp-content/uploads/2017/10/kimchi-vm-creating-1024x253.png)

The other view is called **Gallery View**, which shows a KVM screenshot of the VM. Very useful in case your guest VM has a kernel panic. No need to open a KVM and you can just reboot right away.

![](/wp-content/uploads/2017/10/kimchi-vm.png)

### Misc

You can also see live stats of the hypervisor under the Host tab

![](/wp-content/uploads/2017/10/kimchi-host-overview-1024x517.png)

### Final thoughts:

Since its an HTML5 UI, I like the snappy response, nice colors and layout. If VMware’s vCenter is this nice when it GA’s, I wouldn’t mind giving up my C# client. Its a decent KVM UI manager with a lot of potential.  There are 3 things lacking that I would love to see in the future. I’d like to think of these as must-have’s:

1.  Guest VM performance history
2.  Host hypervisor performance history
3.  Integrated guest VM logging and history (ELK, maybe?)

Future support is multiple KVM hosts, HA and DRS!
