---
title: "Modifying an OVA vmx hardware version"
pubDate: "2015-07-28T14:17:58-07:00"
description: "Ever tried deploying an OVA but the VM version is not supported by your ESX host? Heres how you can modify the vmx file to make it compatible with your host"
categories: ["data-center/vmware/esxi","tips-and-tricks","data-center/vmware"]
tags: ["esxi","ova","ovf","sha1sum","vm","vmware","vmx"]
urlPath: "2015/07/modifying-an-ova-vmx-hardware-version"
wpId: 280
---

Ever tried deploying an OVA but the VM version is not supported by your ESX host? Heres how you can modify the vmx file to make it compatible with your host

![ovf-vmxhwver](/wp-content/uploads/2015/07/ovf-vmxhwver.png)

Uncompress the OVA archive. It can be done with a compression utility like 7-zip. You should now have three different type of files:

-   .mf
-   .ovf
-   .vmdk

**.mf** is the manifest file, which are typically optional and used for integrity and authenticity checks. It contains the SHA1 digest of all files in the package except the manifest file itself.

**.ovf** is the main document of the OVF package, which contains all meta-data that includes external files and virtual disks.

**.vmdk** is the file format that describes the virtual hard drive.

Here is an example of an OVA of a Windows 7 VM that I had uncompressed:

```
[macky.macky-dev] > ls
Win7-GI-disk1.vmdk Win7-GI.mf Win7-GI.ovf
```

### Changing the vmx hardware version:

Edit the \*.ovf file and look for the following line:

```
<vssd:VirtualSystemType>vmx-11</vssd:VirtualSystemType>
```

Go ahead and change the vmx version to a different version like so:

```
<vssd:VirtualSystemType>vmx-10</vssd:VirtualSystemType>
```

Now that the .ovf file has been modified, we’ll need to update the .mf file with the updated SHA1 hash key.

Here is what my \*.mf file looks like:

```
[macky.macky-dev] > cat *.mf
SHA1(Win7-GI-disk1.vmdk)= 4b38254df053bc2672970f73b7d2a8d20ef93397
SHA1(Win7-GI.ovf)= c3c341f16f5bdd60f2e05136b280e4edf1a034c5
```

Run SHA1sum on the \*.ovf file to get the new hash

```
[macky.macky-dev] >  sha1sum Win7-GI.ovf
351dbf5a810d17d7c9e672aa5a12a1fd44ddafef Win7-GI.ovf
```

Take the new hash and update the .mf file like so:

```
[macky.macky-dev] > cat *.mf
SHA1(Win7-GI-disk1.vmdk)= 4b38254df053bc2672970f73b7d2a8d20ef93397
SHA1(Win7-GI.ovf)= 351dbf5a810d17d7c9e672aa5a12a1fd44ddafef
```

Now you’re ready to deploy!
