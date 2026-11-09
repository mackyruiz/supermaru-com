---
title: "VCSA 503 Service Unavailable"
pubDate: "2021-06-04T13:43:02-07:00"
description: "Today I dealt with the infamous VCSA 503 Error. This is a typical problem with VCSAs and when searching for this issue, there is tons of web results pointing to"
categories: ["data-center/vmware"]
tags: ["vcenter","vcsa","vmware"]
heroImage: "/wp-content/uploads/2021/06/Screen-Shot-2021-06-04-at-13.44.27.png"
urlPath: "2021/06/vcsa-503-service-unavailable"
wpId: 626
---

Today I dealt with the infamous VCSA 503 Error.

This is a typical problem with VCSAs and when searching for this issue, there is tons of web results pointing to different things. I stumbled across this really good troubleshooting workflow in this KB article: [https://kb.vmware.com/s/article/67818#service\_unavailable\_flow\_chart.](https://kb.vmware.com/s/article/67818#service_unavailable_flow_chart.)

[![](/wp-content/uploads/2021/06/rtaImage-868x1024.png)](/wp-content/uploads/2021/06/rtaImage.png)

### To start debugging, you will need the following:

1\. Local root login credentials  
2\. SSO administrative credentials  
3\. SSH enabled  
4\. Shell enabled  
You can enable this via <vcsa.fqdn>:5480/appliance/access?locale=en  
(Or go to Access > Access Settings and enable both SSH and Bash Shell)

For my particular issue, i made it to the STS certificates being expired:

`root@photon-machine [ ~ ]# for i in $(/usr/lib/vmware-vmafd/bin/vecs-cli store list); do echo STORE $i; sudo /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store $i --text | egrep "Alias|Not After"; done   STORE MACHINE_SSL_CERT   Alias : __MACHINE_CERT   Not After : Mar 6 19:46:40 2021 GMT   STORE TRUSTED_ROOTS   Alias : d4e4ecbbf3518a62ea540c98d9597736aa272452   Not After : Mar 1 07:46:37 2029 GMT   STORE TRUSTED_ROOT_CRLS   Alias : c0c44dcd89af6512fd3c687e2e41e1ca12399059   STORE machine   Alias : machine   Not After : Mar 6 07:38:20 2021 GMT   STORE vsphere-webclient   Alias : vsphere-webclient   Not After : Mar 6 07:38:27 2021 GMT   STORE vpxd   Alias : vpxd   Not After : Mar 6 07:38:33 2021 GMT   STORE vpxd-extension   Alias : vpxd-extension   Not After : Mar 6 07:38:40 2021 GMT   STORE SMS   Alias : sms_self_signed   Not After : Mar 7 08:07:34 2029 GMT`

You can also check for certificate one at a time like so:  
`/usr/lib/vmware-vmafd/bin/vecs-cli entry list --store MACHINE_SSL_CERT --text   /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store machine --text   /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store vpxd --text   /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store vsphere-webclient`

### VSphere 6.X Certificate Manager

Before proceeding, please take a snapshot of the VCSA so you can roll back if you cause any further damage. I followed this KB article and used the Certificate Manager to regenerate and replace the certificates: [https://kb.vmware.com/s/article/2097936](https://kb.vmware.com/s/article/2097936)

Now that SSH is enabled, you can log into the VCSA and drop into a shell like so:

`➜ ~ ssh root@<your IP here>   Command> shell   Shell access is granted to root   root@photon-machine [ ~ ]#`

`root@photon-machine [ /tmp ]# /usr/lib/vmware-vmca/bin/certificate-manager   _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _   | |   | *** Welcome to the vSphere 6.5 Certificate Manager *** |   | |   | -- Select Operation -- |   | |   | 1. Replace Machine SSL certificate with Custom Certificate |   | |   | 2. Replace VMCA Root certificate with Custom Signing |   | Certificate and replace all Certificates |   | |   | 3. Replace Machine SSL certificate with VMCA Certificate |   | |   | 4. Regenerate a new VMCA Root Certificate and |   | replace all certificates |   | |   | 5. Replace Solution user certificates with |   | Custom Certificate |   | |   | 6. Replace Solution user certificates with VMCA certificates |   | |   | 7. Revert last performed operation by re-publishing old |   | certificates |   | |   | 8. Reset all Certificates |   |_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _|   Note : Use Ctrl-D to exit.   Option[1 to 8]: 4   Do you wish to generate all certificates using configuration file : Option[Y/N] ? : Y   Please provide valid SSO and VC priviledged user credential to perform certificate operations.   Enter username [Administrator@vsphere.local]:   Enter password:   certool.cfg file exists, Do you wish to reconfigure : Option[Y/N] ? : N   You are going to regenerate Root Certificate and all other certificates using VMCA   Continue operation : Option[Y/N] ? : Y   Get site nameCompleted [Replacing Machine SSL Cert…]   first   Lookup all services`  
..  
<OUTPUT OMMITED… Its really long>  
..  
..  
Updated 30 service(s)  
Status : 60% Completed \[Replace vpxd-extension Cert…\]  
2021-06-04T18:47:54.660Z Updating certificate for “com.vmware.vim.eam” extension  
2021-06-04T18:47:54.793Z Updating certificate for “com.vmware.rbd” extension  
Status : 100% Completed \[All tasks completed successfully\]

  
In the Certificate manager, I chose option #4: “Regenerate a new VMCA Root Certificate and replace all certificates”.

I also opted NOT to change certool.cfg.

You can verify that the certificates are up to date with the same one-liner:

`root@photon-machine [ ~ ]# for i in $(/usr/lib/vmware-vmafd/bin/vecs-cli store list); do echo STORE $i; sudo /usr/lib/vmware-vmafd/bin/vecs-cli entry list --store $i --text | egrep "Alias|Not After"; done   STORE MACHINE_SSL_CERT   Alias : __MACHINE_CERT   Not After : Jun 4 18:31:22 2023 GMT   STORE TRUSTED_ROOTS   Alias : d4e4ecbbf3518a62ea540c98d9597736aa272452   Not After : Mar 1 07:46:37 2029 GMT   Alias : fb11bfcd4564c22dc29edc82c9ace481dc005f67   Not After : May 30 18:35:31 2031 GMT   Alias : dea59b8300f05778b7a84969cb35361743d1c79a   Not After : May 30 18:41:21 2031 GMT   STORE TRUSTED_ROOT_CRLS   Alias : 495493f7392f33f9dc49d46686ab127e81871905   Alias : 396e5cd0e11e74c3a233c0015954fce015829373   Alias : 4708735cea2c30c51747361977a0655265235e29   STORE machine   Alias : machine   Not After : Jun 4 18:37:53 2023 GMT   STORE vsphere-webclient   Alias : vsphere-webclient   Not After : Jun 4 18:37:53 2023 GMT   STORE vpxd   Alias : vpxd   Not After : Jun 4 18:37:54 2023 GMT   STORE vpxd-extension   Alias : vpxd-extension   Not After : Jun 4 18:37:54 2023 GMT   STORE SMS   Alias : sms_self_signed   Not After : Mar 7 08:07:34 2029 GMT   STORE BACKUP_STORE   Alias : bkp___MACHINE_CERT   Not After : Mar 6 19:46:40 2021 GMT   Alias : bkp_machine   Not After : Mar 6 07:38:20 2021 GMT   Alias : bkp_vsphere-webclient   Not After : Mar 6 07:38:27 2021 GMT   Alias : bkp_vpxd   Not After : Mar 6 07:38:33 2021 GMT   Alias : bkp_vpxd-extension   Not After : Mar 6 07:38:40 2021 GMT`

Now if you try to log into your VCSA, your HTTP 503 error should be gone!
