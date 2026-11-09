---
title: "Two Factor Authentication for free"
pubDate: "2015-01-20T08:52:34-08:00"
description: "Sounds cool! But what is it? Lets start off on what its made of: Knowledge based authentication. Possession based authentication. A good example of two-factor"
categories: ["security"]
tags: ["authentication","security","two-factor"]
urlPath: "2015/01/securing-accounts"
wpId: 213
---

## Sounds cool! But what is it?

Lets start off on what its made of:

-   Knowledge based authentication.
-   Possession based authentication.

A good example of two-factor authentication is your ATM card. You know your PIN. Its something you made up. But that is something anyone can glimpse over and see. To safeguard that, you need your ATM card, which is something you posses and typically have in safe keeping. Requiring both increases the difficulty of providing false credentials.

Two factor authentication can be used for securing down email, social media accounts, etc. Today, we’ll focus on Google’s Authenticator app, available on iPhone and Android. This app is a software provides a six digit timed based one-time password (TOTP) that automatically regenerates within 30 seconds.

## Want to try it out?

Here is [instructions](https://support.google.com/accounts/answer/1066447?hl=en) on how to install Google Authenticator with your gmail account. For corporate users, it is similar, but if you don’t have the option to enroll, check with your Systems Administrator.

Pros:

-   No need for a physical RSA key fob.
-   OTPs constantly change unlike your password, which is probably the same on your email, facebook, and computer for years.

Cons:

-   You’re phone has to be charged! You do have 10 static one time passwords (OTP) you can print out in case of emergency.
-   If your phone gets lost or stolen, access is near to impossible unless you have a print out of the static OTPs somewhere.
-   It can get annoying.

## Setting it up on non-google accounts

Here is instructions on how to do it on Facebook :

Go to: Settings -> Security  
Expand Code Generator and click “Set up”.

![Screen Shot 2015-01-19 at 11.59.15 PM](/wp-content/uploads/2015/01/Screen-Shot-2015-01-19-at-11.59.15-PM-272x300.png)

On the Google Authenticator App, (on iPhone) tap the pencil icon on the top right then the + button to add an entry. You can either scan a QR barcode, or manually enter the shared key.

Don’t use gmail or Facebook? Its okay, you can lockdown Dropbox, AWS, OpenVPN, Microsoft Accounts, and even WordPress! There is a growing list of applications that is supported. Check out [https://twofactorauth.org](https://twofactorauth.org/) and look at the “software implementation” column.
