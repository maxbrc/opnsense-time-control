# Parental Time Controls for OPNsense
This small application enables you control the internet access of all devices on your OPNsense firewall using it's API interface.
![demo picture of the application](https://github.com/maxbrc/opnsense-time-control/blob/main/demo.png?raw=true)
## Features
- Master internet switch
- Unlimited schedules
- Robust error handling

[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?logo=mongodb&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=fff)](#)
## Setup Guide
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

### Creating the Rule
Currently this application only supports controlling one rule and only via the device's IP addresses (and IPv4 only). You need to locate the IP addresses of your devices.
Because you're probably using DHCPv4 for assignments, you can go to the **Services > DHCPv4 > Leases** tab and locate the devices via their hostnames.
I recommend to create a static mapping for the devices you want to control to prevent them getting a new IP address.
Once you took note of all IP addresses, I recommend adding them to an alias. You can create an alias under **Firewall > Aliases**.
Create the rule under **Firewall > Automation > Filter**. The rule should look like the following:
```
Action: Block
Interface: <Select Interface>
Source: <Select Alias>
Description: <Appropriate Description>
All other values should be the default.
```
### Finding the Rule UUID
This step is probably the most difficult, but I intend to create a small script to find the uuid of the rule very soon.
Go to **Firewall > Automation > Filter** and open the developer tools of your browser.
Go to the Network tab and show only Fetch/XHR. Refresh the page. You should see a request by the name `search_rule/`.
To the right of this, you should be able to select "Response" to see the response body.
You will see some JSON containing all the rules and their UUID's. Locate the rule and copy the UUID.

### Docker (recommended)
Coming soon...
### systemd
#### Requirements
- Locate your node executable by using `which node`
- From OPNsense, grab the API key, it's secret and the UUID of the correct rule (see "Finding the rule UUID")
- A running MongoDB instance. Take a look at https://www.mongodb.com/docs/manual/installation/. Follow through the entire guide for your operating system and make sure `mongod` is running.
#### Procedure
1. Pull the latest stable release
2. Create a systemd service
  - Create `opnsense-time-control.service` at `/etc/systemd/system/`
  - Paste the following content
```
[Unit]
After=network.service

[Service]
ExecStart=/path/to/node/executable /path/to/the/release/server/dist/index.js>
Type=simple
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
  - Make sure to adjust the path of the Node executable and the location of the release files (must end in server/dist/index.js).
3. Move .env.server.example and .env.common.example to .env and .env.common. For UNIX-based systems (e.g. Ubuntu): `cp .env.server.example .env.server && cp .env.common.example .env.common`
4. Enter you API credentials, the rule's UUID and your firewall's URL in the `.env.server` file. Change the application URL in `.env.common`. If your MongoDB instance is not installed with default settings, you may also alter the URI in `.env.server`.
5. `systemctl daemon-reload && systemctl enable opnsense-time-control && systemctl start opnsense-time-control`
6. Check the service log files, by doing `service opnsense-time-control status`. If no errors appear and the service is running, you're finished!
7. Point a reverse proxy like nginx or Traefik to `http://<address>:3000/` (by default)


## Working with / compiling source code
### Requirements
- Node and NPM
### How To
1. Download the ZIP file
2. Navigate into the folder
3. `npm install`
4. To run the dev server, do `npm run dev`. This will cause both wepback to watch the frontend and tsc to watch the backend code simultaneously. The only thing you need to do is to refresh the page.
5. When finished editing, do `npm run build`
6. `node server/index.js`
7. Go to `http://localhost:3000/`
## Features in work
- **Highest Priority:** Creation of a bash script for automating installation with systemd
- **High Priority:** Availabilty of a dockerized version
- **High Priority:** Script for finding the rule uuid automatically
- Typing of API requests to OPNsense
- Ability to select weekdays for schedules
- Authentication system
- Implement a way to trust OPNsense's certificate
- Create a better error reporting system
- A configurable log system (debug, info, off)
- A timer option for turning internet back on/off in x time
- Ability to select port
## Larger, planned features
- A ticket system to allow restricted users to gain extra time
- Somehow implement a system to track total internet usage time and limit that in connection with the absolute time based restriction
## When can I expect these features?
This is my first open source project and I am very passionate about it. Hence I will pour all my energy into it.
This means you can expect features in work within the next month or two, meaning February 2025. Planned features may in rare cases be discarded because they're not possible or I don't posess the necessary skills yet (collaboration on this project is welcome!).