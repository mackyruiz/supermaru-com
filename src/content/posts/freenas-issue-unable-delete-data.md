---
title: "FreeNAS issue: unable to delete data?!"
pubDate: "2014-09-18T00:30:52-07:00"
description: "I ran into an interesting issue on one of my FreeNAS servers where I had let the zfs storage pool fill up and I was unable to delete any data. My freenas"
categories: ["tips-and-tricks"]
tags: ["freenas","storage","zfs"]
urlPath: "2014/09/freenas-issue-unable-delete-data"
wpId: 176
---

I ran into an interesting issue on one of my FreeNAS servers where I had let the zfs storage pool fill up and I was unable to delete any data.

My freenas Version: FreeNAS-9.1.1-RELEASE-x86

```
[root@mackynas1] /mnt/share1/# rm -f test.dat
 rm: test.dat: Disc quota exceeded
```

I had a couple options:

1.  Expand the pool by getting rid of the reservation I had set, then delete data.
2.  Add physical drives to my NAS, then expand the volume
3.  Be stubborn and find a way to fix this.

#1 is too easy, and #2 cost money… so #3 it is. Luckily I had found a workaround on the FreeNAS forums where you zero out a file you would like to delete. Here I need to delete test.dat:

```
[root@mackynas1] /mnt/share1/# cp /dev/null test.dat
[root@mackynas1] /mnt/share1/# rm -f test.dat
```

Now I was able to delete that test.dat file and any other big files I didn’t care too much for.
