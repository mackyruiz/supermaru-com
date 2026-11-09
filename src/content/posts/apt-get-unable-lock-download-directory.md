---
title: "apt-get – unable to lock the download directory"
pubDate: "2017-02-14T18:21:27-08:00"
description: "I had an issue where a system refused to do any apt-get updates. I think the user must of tried running apt-get update and canceled half-way through. My usual"
categories: ["linux","tips-and-tricks","uncategorized"]
urlPath: "2017/02/apt-get-unable-lock-download-directory"
wpId: 375
---

I had an issue where a system refused to do any apt-get updates. I think the user must of tried running apt-get update and canceled half-way through. My usual trick of running  apt-get clean did not work so well:

```
E: Some index files failed to download. They have been ignored, or old ones used instead.
E: Could not get lock /var/lib/dpkg/lock - open (11: Resource temporarily unavailable)
E: Unable to lock the administration directory (/var/lib/dpkg/), is another process using it?


:~# apt-get clean
E: Could not get lock /var/cache/apt/archives/lock - open (11: Resource temporarily unavailable)
E: Unable to lock the download directory
```

I managed to get around the issue by removing any lock files in /var/lib/apt/lists, /var/cache/apt/archives and /var/lib/dpkg

```
~# rm /var/lib/apt/lists/lock
~# rm /var/cache/apt/archives/lock
~# rm /var/lib/dpkg/lock
```

Once that was done, i was able to run apt-get clean and had to fix an issue running dpkg

```
~# apt-get clean
~# apt-get autoremove
E: dpkg was interrupted, you must manually run 'dpkg --configure -a' to correct the problem.
~# dpkg --configure -a
```
