FeedHenry Sync Angular Client
=============================

Front end application that uses Angular and Ionic to build a UI, and the
FeedHenry SDK Sync feature to access data from the Cloud and store it on device.

The associated Cloud Application for this can be found at [sync-angular-cloud](https://github.com/RHMAP-Sample-Mobile-Apps/sync-angular-cloud), while the MBaaS Service is located at [sync-angular-mbaas-service](https://github.com/RHMAP-Sample-Mobile-Apps/sync-angular-mbaas-service).

## Local Development

Assuming you have node.js and npm installed, you can run this application locally by using the following commands:

```
cd sync-angular-client
npm install
npm start
```

This will open the application in a browser (only Chrome is tested) and allow
you to interact with the local Cloud (linked above) and Service
(also linked above) to create users in the MBaaS Service.
