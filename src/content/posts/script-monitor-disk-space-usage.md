---
title: "Script to monitor disk space usage"
pubDate: "2016-10-30T14:44:21-07:00"
description: "Here is a quick and easy script that you can add to your crontab to monitor disk space consumption. Once you hit 85% disk utilization, you automatically send an"
categories: ["linux"]
tags: ["linux"]
urlPath: "2016/10/script-monitor-disk-space-usage"
wpId: 356
---

Here is a quick and easy script that you can add to your crontab to monitor disk space consumption. Once you hit 85% disk utilization, you automatically send an email to yourself

```
# cat space-monitor.sh
#!/bin/bash
#This script runs nightly to check disk space usage
ADMIN="macky@supermaru.com"
```

```
df -h | grep -vE '^Filesystem|tmpfs|cdrom' | awk '{print $5 " " $1 }' | while read output;
do
 usep=$(echo $output | awk '{ print $1}' | cut -d'%' -f1 )
 partition=$(echo $output | awk '{ print $2 }' )
 if [ $usep -ge 85 ]; then
 echo "Running out of space \"$partition ($usep%)\" as on $(date)" > /tmp/email.txt
 mail -s "Alert: $partition Almost out of disk space" $ADMIN < /tmp/email.txt ;
 fi
done
```

**Email example:**

Subject: Alert: /ftp Almost out of disk space

Running out of space “/ftp (93%)” as on Fri Oct  7 00:00:01 PDT 2016
