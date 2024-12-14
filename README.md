# This repository is **very very** young and thus does not offer any usable code nor completely correct documentation. (Just wait a few more days)
# Parental Time Controls for OPNsense
This small application enables you control the internet access of all devices on your OPNsense firewall using it's API interface.
## Features
- Master internet switch
- Unlimited schedules
- Robust error handling

## Installation Guide
### OPNsense API access
For security reason, I recommend that you create a dedicated user for this specific application. It allows you to work with minimal privilege, giving you the most security in case something gets compromised.
1. Create a new user under **System > Access > Users**
2. Set Login shell to `/usr/sbin/nologin`. This prevents this user from being used to log into the firewall (just API access).
3. Under **Effective Privileges** grant the user the following privileges:
  - Firewall: Automation: Filter
  - System: Status
4. Create a new API key
5. The downloaded file contains everything you need to progress further.
6. Don't forget to **Save and go back**.

### Using Docker (recommended)
Coming soon...
### Using systemd
#### Requirements
- Locate your node executable by using `which node`
- From OPNsense, grab the API key, it's secret and the UUID of the correct rule
- A running MongoDB instance. Take a look at https://www.mongodb.com/docs/manual/installation/. Follow through the entire guide for your operating system and make sure `mongod` is running.
#### Procedure
1. Pull the latest stable release
2. Create a systemd service
  1. Create `opnsense-time-control.service` at `/etc/systemd/system/`
  2. Paste the following content
```
[Unit]
After=network.service

[Service]
ExecStart=/path/to/node/executable /path/to/the/release>
Type=simple
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
  3. Make sure to adjust the path of the Node executable and the location of the release files.
3. Enter you API credentials and the rule's UUID in the .env file. You can also change the port of the webserver there.
4. `systemctl daemon-reload && systemctl enable opnsense-time-control && systemctl start opnsense-time-control`
5. Check the service log files, by doing `service opnsense-time-control status`. If no errors appear and the service is running, you're finished!


## Working with / compiling source code
### Requirements
- Node and NPM
### How To
1. Download the ZIP file
2. Navigate into the folder
3. `npm install`
4. When finished editing, do `npm run build`
5. `node server/index.js`

## Features in work
- Typing of API requests to OPNsense
- Ability to select weekdays for schedules
- Authentication system
- Implement a way to trust OPNsense's certificate