---
title: "BSidesLV and Multi-Cloud Security"
pubDate: "2025-08-22T11:49:00-07:00"
description: "I attended a two-day multi-cloud red teaming course at BSidesLV. The folks over at labs.cyberwarfare.live were conducting the training session and below are my"
categories: ["conferences","security","updates"]
tags: ["bsides","ctf","linux","security"]
heroImage: "/wp-content/uploads/2025/08/ChatGPT-Image-Aug-17-2025-11_57_39-PM.png"
urlPath: "2025/08/bsideslv-and-multi-cloud-security"
wpId: 709
---

I attended a two-day multi-cloud red teaming course at BSidesLV. The folks over at labs.cyberwarfare.live were conducting the training session and below are my own thoughts:

### Intro to Multi-Cloud Red Teaming

Analyse and investigate various Web, Network, Host And Active Directory based attacks by various defensive solutions. Hunt Cyber Threats in a realistic enterprise environment.

All three public cloud labs are done Jeopardy-style CTFs where there is a question, you provide the answer (also known as flag) and get points.

## Day 1: AWS

  
Most of the day was spent on the overview of programatic access on public cloud infrastructure and how it differs than traditional on-premise environments. Good chunk of time was also spent on setting up our own environment with AWS CLI.

Things i’ve learned:  
1\. Always sanitize user inputs  
2\. Look at any public attack surface. Use OSINT!  
3\. Protect your session token and secrets

[![](/wp-content/uploads/2025/08/Screenshot-2025-08-17-at-23.54.51.png)](/wp-content/uploads/2025/08/Screenshot-2025-08-17-at-23.54.51.png)

Without going into it much, all we are given is a name of an organization, the executive summary, and the objective. It is up to us as students to find out any vulnerabilities.

We had used tools such as cloud-enum to enumerate public resources in AWS, Azure, and GCP: [https://github.com/initstring/cloud\_enum](https://github.com/initstring/cloud_enum)

As of this writing, it enumerates the following:  
**Amazon Web Services:**

-   Open / Protected S3 Buckets
-   awsapps (WorkMail, WorkDocs, Connect, etc.)

**Microsoft Azure**

-   Storage Accounts
-   Open Blob Storage Containers
-   Hosted Databases
-   Virtual Machines
-   Web Apps

**Google Cloud Platform**

-   Open / Protected GCP Buckets
-   Open / Protected Firebase Realtime Databases
-   Google App Engine sites
-   Cloud Functions (enumerates project/regions with existing functions, then brute forces actual function names)
-   Open Firebase Apps

Based on that data you can gather from OSINT, you can go down the rabbit hole. Obviously our labs had some clues on the environment and servers that are running. I found a development web server and was able to use tools like [Burpsuite](https://portswigger.net/burp/communitydownload) to figure out some web forms had fields that was vulnerabile to SSR, or Server-Side Request Forgery. The environments were public cloud based so I was able to abuse a universal internal IP address: 169.254.169.254. This allows cloud instances to access metadata about themselves.

**Abusing inherent trust**

This metadata IP is only accessible from the cloud resources itself and closed off from the outside world. But if you find any vulnerability where there is any misconfiguration that allows for unintentional access from containers and applications then you may run the risk of exposing IAM role credentials. And that is exactly what the theme of the labs were.

## Day 2: GCP and Azure

More or less the same as day 1, except we jump straight into GCP. I was able to abuse web forms by running something like:

```
curl -H "Metadata-Flavor:Google"  http://169.254.169.254/computeMetadata/v1/instance/service-accounts/ some-account@somedomain.iam.gserviceaccount.com/!
```

Azure was my least favorite as there is 2 or 3 ways to connect to that environment. Just why?

I had to use a different tool to figureout the subdomains for this exercise. We used [https://github.com/ffuf/ffuf](https://github.com/ffuf/ffuf)

We also needed a wordlist, so we used a dictionary file. Ex: [http://ffuf.me/wordlists](http://ffuf.me/wordlists) 

```
wget -r --no-parent -R "index.html*" https://wordlists-cdn.assetnote.io/data/ -nH -e robots=off
```

This is where things got messy: I was using ParrotOS the day prior and was told to try out CWL’s version called RedcloudOS for this part of the lab. They apparently had all the tools installed… but they didn’t. I tried installing powershell on my localhost, which is running Fedora Linux but also ran into problems. I ended up running everything via Docker: [https://learn.microsoft.com/en-us/powershell/azure/azureps-in-docker?view=azps-14.2.0&tabs=amd64](https://learn.microsoft.com/en-us/powershell/azure/azureps-in-docker?view=azps-14.2.0&tabs=amd64)

```
docker pull mcr.microsoft.com/azure-powershell:azurelinux-3.0
```

```
docker run -it mcr.microsoft.com/azure-powershell:azurelinux-3.0 pwsh
```

Once we had to pivot we had to then use _another_ way to connect to the cloud: MS Graph PowerShell.. Why?? I also struggled to install it here and also in the above docker container. I ultimately ran this in its own docker container as well: [https://learn.microsoft.com/en-us/powershell/azure/azureps-in-docker?view=azps-14.2.0&tabs=amd64](https://learn.microsoft.com/en-us/powershell/azure/azureps-in-docker?view=azps-14.2.0&tabs=amd64)

```
docker pull mcr.microsoft.com/microsoftgraph/powershell:latest
```

```
docker run -it mcr.microsoft.com/microsoftgraph/powershell:latest
```

I eventually ran into problems where the token I hijacked and abused through Powershell did not work on MS Graph Powershell. I kept running into the error `Connect-MgGraph: Cannot bind parameter 'AccessToken'. Cannot convert the value of type "System.String" to type "System.Security.SecureString".`

Instructors had also hit the wall and was scratching their heads on this issue. I ended up going to ChatGPT for help and this got me unblocked:

```
$token = "<your_access_token_here>"

# Convert to SecureString
$secureToken = ConvertTo-SecureString $token -AsPlainText -Force

# Connect to Microsoft Graph
Connect-MgGraph -AccessToken $secureToken
```

After 16 hours, 10 CTF questions per public cloud, I was able to achieve this completion certificate:

[![](/wp-content/uploads/2025/08/Screenshot-2025-08-17-at-23.54.14.png)](/wp-content/uploads/2025/08/Screenshot-2025-08-17-at-23.54.14.png)

## Below is my own opinion and feedback of the course:

**Negatives:**

1.  Instructors need to be better prepared.
    1.  Showed up late to first day of class
    2.  No HDMI cable, so they couldn’t share the screen to the projector
    3.  Public Cloud changes. I get it, so demos won’t go as planned. But if it works for 1 instructor’s machine but not the others… seriously figure it out before class. How are we, the learners supposed to know if the teachers doesnt? 
2.  Better preparation for students
    1.  Should have an outline or something for students to do before class. Good 1/4th of class was setup 
    2.  You have people from different walks of life and 3 different variants of devices: Windows, MacOS and Linux. Have a cheat sheet for them in advanced
3.  If you keep advertising students should use your RedCloud Virtual appliance, then maintain it!
    1.  Its fine if its out of date and it **works** for the lab, but it didnt
    2.  Firefox couldn’t open the google drive [bit.ly](http://bit.ly) link
    3.  Azure CLI wasn’t installed. Same for Powershell, so this was useless for 1/3rd of the class
    4.  Vanilla ParrotOS was sufficient for 2/3rd of the lab
    5.  I spent a good chunk of time Monday night fixing gpg errors from apt update
4.  Better time management
    1.  See point #2
    2.  When you say “5 minute break” or “couple minute coffee break” implies 2-5 minutes. Not 30 minutes
    3.  Day 1 was slow
    4.  Day 2 was rushed
5.  Listen. Seriously, listen.
    1.  Some students explicitly asked what is needed for the Azure portion and if we need a windows VM. You nodded your head and said yes.
        1.  Then we asked to confirm, then you said your RedCloud VM is sufficient. All we needed is VMware
        2.  During the Azure portion it changed 
    2.  We asked where they get the wordlist for fuzzing the subdomain.
        1.  They did not get the question and shrugged off the student
6.  No Wifi on Day 1. We’re in a conference room full of IT Security professionals. Seriously?
7.  Take some public speaking courses.
    1.  Learn to pace
    2.  Learn how to present. At least an intro instead of just jumping straight into it

**Positives:**

1.  Labs were nicely done
2.  Misconfigured Github repos and endpoints we attacked were great
