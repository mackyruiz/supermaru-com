---
title: "Spotify on Ubuntu"
pubDate: "2015-04-23T15:59:55-07:00"
description: "Spotify has a preview build for Linux users! I have it successfully running on Ubuntu 14.04.5 LTS Instructions from their website: # 1. Add this line to your"
categories: ["linux"]
tags: ["preview-build","spotify"]
urlPath: "2015/04/spotify-ubuntu"
wpId: 256
---

Spotify has a [preview build](https://www.spotify.com/us/download/previews/) for Linux users! I have it successfully running on Ubuntu 14.04.5 LTS

Instructions from their website:

```
# 1. Add this line to your list of repositories by
#    editing your /etc/apt/sources.list
deb http://repository.spotify.com stable non-free

# 2. If you want to verify the downloaded packages,
#    you will need to add our public key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 94558F59

# 3. Run apt-get update
sudo apt-get update

# 4. Install spotify!
sudo apt-get install spotify-client
```

Obviously since this is a unsupported preview build, I managed to run into an issue where I would click the Spotify icon, but nothing happens. Opened a terminal session and ran “spotify” and got the following error:

```
macky@maru-lx1:~$ spotify
spotify: error while loading shared libraries: libudev.so.1: cannot open shared object file: No such file or directory
```

Workaround:

I did a copy of libudev.so.0 and everything is working so far (knock on wood).

```
macky@maru-lx1:/opt/spotify/spotify-client$ cd /lib/x86_64-linux-gnu/
macky@maru-lx1:/lib/x86_64-linux-gnu$ sudo ln -sf libudev.so.0 libudev.so.1
```

If you are missing libudev.so, go ahead and install:

```
macky@maru-lx1:~$ sudo apt-get install libudev0
```

If you try running Spotify and its complaining about livudev.so.1, follow the instructions above.

Now you can enjoy Spotify on your Linux machine 🙂
