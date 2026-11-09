---
title: "vCSA 6.0 automated deployment"
pubDate: "2015-10-07T13:30:51-07:00"
description: "Doing the first batches of vCenter Server Appliance (vCSA) 6.0 deployment was kinda…rough. Playing around with the OVA and getting annoyed at the web-based"
categories: ["linux","data-center/vmware"]
tags: ["6-0","6-0-u1","cli","linux","ova","ovf","vcenter","vcsa","vmware"]
urlPath: "2015/10/vcsa-6-0-automated-deployment"
wpId: 294
---

Doing the first batches of vCenter Server Appliance (vCSA) 6.0 deployment was kinda…rough. Playing around with the OVA and getting annoyed at the web-based deployment option kind of slowed us down. At my current job we prefer vCSA’s for our Test and Dev environments and dont want to deal with Windows Server. Fortunately VMware has given us the option of deploying through the command line!

### Where?!

You can deploy a vCSA to any ESX server on your network. Its in the VCSA ISO and its called “vcsa-cli-installer”

### How does it work?

The cli installer uses a JSON file to help populate the necessary parameters, which makes it easy for us to automate deployment and turn around vCSAs faster.

Once you have extracted out the directory to your \*nix system, you should see the following directories to quickly get you started: “lin64” and “templates”.

```
# ls
dbchecker lin64 templates
```

### Files you care about

In the lin64 directory, there is a file called “vcsa-deploy”.

In the templates directory, there are JSON templates you can modify to quickly deploy our VCSA.

Once you have gotten your JSON file populated with your enviornment information, you deploy by running:

```
 ./vcsa-deploy path-to-your-json.file.json
```

### Automating deployments

Since we generate vCSAs frequently, having an option to use JSON files is perfect. You can take a provided template and modify it even more to suit your needs.

**JSON templates:**

vCSA 6.0 and 6.0b: Templates are the same. For stand-alone vCenters we found that the embedded.example.json is good enough for our needs.

vCSA 6.0U1: The template has changed the format and requires version 1.1, which my scripted deployments I am sharing revolves around.

### Scripted deployments:

You can write a simple wrapper bash script to take care of deployments for you. Since we provision vCSAs and they are for different testbeds, I decided to automate the creation of the JSON template, verify that the DNS entries for the vCenter is correct by doing a simple nslookup and sending an email notification with log outputs once its completed (or failed).

Here is the script you can use yourself and modify for 6.0U1.

**Requirements:**

I expect the following directories: _json_ and _vc6.0u1_

file directory tree that I care about:  
.  
|-deploy6u1.sh  
|-json  
|    |–6.0u1  
|        |\_template.json  
|-vc6.0u1  
|-vcsa-cli-installer  
|-lin64

**json file and directory:**  
I used the embedded\_vCSA\_on\_VC.json and renamed it to _template.json_ in the _json_ direcory  
Since I have deployment scripts for other versions, I dump 6.0U1 JSONs in _6.0u1._ During deployment, I copy _template.json_ and name it whatever the name of the vCSA is.

Here is a modified version of my _template.json_. I took out items that we hard-code such as DNS servers and default vCSA passwords:

```
# cat json/6.0u1/template.json
{
 "__version": "1.1",
 "__comments": "Sample template to deploy a vCenter Server with an embedded Platform Services Controller to an ESXi host 6.0U1 09/22/15 MR",
 "target.vcsa": {
 "appliance": {
 "deployment.network": "VMNW",
 "deployment.option": "SIZE",
 "name": "VCSANAME",
 "thin.disk.mode": true
 },
 "esx": {
 "hostname": "EHOSTNAME",
 "username": "root",
 "password": "ESXPW",
 "datastore": "EDATASTORE"
 },
 "network": {
 "hostname": "VCSANAME",
 "dns.servers": [
 "1.2.3.4",
 "5.6.7.8"
 ],
 "gateway": "GW",
 "ip": "IPADDR",
 "ip.family": "ipv4",
 "mode": "static",
 "prefix": "CIDR"
 },
 "os": {
 "password": "Password1!",
 "ssh.enable": true,
 "ntp.servers": "9.8.7.6"
 },
 "sso": {
 "password": "Password1!",
 "domain-name": "vsphere.local",
 "site-name": "VCSANAME"
 }
 }
}
```

**Here are lines you should change to work in your environment:**

Under the “esx” section:

```
 "dns.servers": [
 "1.2.3.4", <- This is your primary DNS server
 "5.6.7.8"  <- This is your secondary DNS server
```

Under “os” section:

```
 "ntp.servers": "9.8.7.6" <- Change this IP address
```

Under the “os” and “sso” section:

```
 "password": "Password1!", <- Change the password to your liking.
```

Here is my wrapper script I use. I also have removed hard-coded items here.

```
# cat deploy6u1.sh
#!/bin/bash
#092215
#Script for VCSA 6.0 Update 1 deployment
#MR
cd json/6.0u1
itmail='you@company.com'
#Steps below creates a new JSON file for deployment
echo "Enter the new VCSA name: "
 read name
 cp template.json $name.json
 sed -i "s/VCSANAME/$name/g" $name.json
 date=`date +"%m%d%y"`
 vlog=/var/log/$name-$date
echo "Enter the VCSA's IP address: "
 read ip
 sed -i "s/IPADDR/$ip/g" $name.json
#DNS check
fwd=`nslookup $name | grep $name -A2 | grep Address | awk '{print $2}'`
rev=`nslookup $ip | grep name | awk '{print $4}'`
if [ $name.your.domain != $rev ]
then
 echo "Forward and reverse DNS lookup FAILED. Aborting deployment."
 exit
fi
#End DNS check
echo "Enter the vCenter deployment size. Default is small (<1000 VMs). For: "
echo "< 100 VMs, type 'tiny'"
echo "< 4,000 VMs, type 'medium'"
echo "< 1,000 VMs, type 'large'"
 read envsize
 if [[ -z $envsize ]];
 then
 sed -i "s/SIZE/small/g" $name.json
 echo "Setting default environment to 'small'."
 else
 sed -i "s/SIZE/$envsize/g" $name.json
 fi
echo "Enter the VCSA's netmask in CIDR notation (Press Enter for default: 21): "
 read cidr
 if [[ $cidr -eq 0 ]];
 then
 sed -i "s/CIDR/21/g" $name.json
 echo "Setting /21"
 else
 sed -i "s/CIDR/$cidr/g" $name.json
 fi
echo "Enter the VCSA's default gateway address: "
 read gw
 sed -i "s/GW/$gw/g" $name.json
echo "Enter the target ESX host to install: "
 read esx
 sed -i "s/EHOSTNAME/$esx/g" $name.json
echo "Enter the target ESX password (warning: in cleartext!): "
 read pw
 sed -i "s/ESXPW/$pw/g" $name.json
echo "Enter the target ESX datastore to install: "
 read datastore
 sed -i "s/EDATASTORE/$datastore/g" $name.json
echo "Enter the ESX deployment network: (Press Enter for default "VM Network") "
 read nw
 if [[ -z $nw ]];
 then
 sed -i "s/VMNW/VM Network/g" $name.json
 echo "Setting default 'VM Network'."
 else
 sed -i "s/VMNW/$nw/g" $name.json
 fi
echo "$name.json created."
cd ../../vc6.0u1/vcsa-cli-installer/lin64/
./vcsa-deploy ../../../json/6.0u1/$name.json --accept-eula -v 2>&1 | tee /var/log/$name.deploy
cat /var/log/$name.deploy | mail -s "VCSA $name completed" $itmail
```

**Items you have to manually change:**

Email recepient, line 8:

```
itmail='you@company.com'
```

Under the #DNS check section, you should change “your.domain”.

```
if [ $name.your.domain != $rev ]
```

### Email notification and logs

The emails contains the deployment progress and log location incase things go south. So when you go and get your cup of coffee as you kick off deployment, you’ll get an email notification if deployment done (successful or failed).

### Future improvements and things to note:

I’m planning on adding a field during deployment if you want a second person to get notified with a simple email that deployment was **successful.** I’ll add this to my public git repo, one day…

For deploying on a ESX host that does not have the rsa-key in your \*nix system, you might have to type “yes” to continue and the OVF deployment starts.

There are no pre-checks of host names and IP addresses when deploying the vCSA – other than my forward and reverse lookup for the vCSA hostname. Make sure your target vCSA netmask, gateway,  ESX server information and credentials are correct.

And finally: I am not a developer! A skilled person who writes code for a living can probably write it in less lines of code, or/and add more intelligence.

### More reading:

VMware has a technical doc on CLI based deployments: [http://www.vmware.com/files/pdf/products/vsphere/VMware-vsphere-60-vcenter-server-appliance-cmdline-install.pdf](http://www.vmware.com/files/pdf/products/vsphere/VMware-vsphere-60-vcenter-server-appliance-cmdline-install.pdf)
