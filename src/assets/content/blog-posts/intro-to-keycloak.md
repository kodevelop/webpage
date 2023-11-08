![Keycloak logo](https://www.keycloak.org/resources/images/icon.svg)

# Introduction to Keycloak

## What is keycloak

Keycloak is an opensource identity and access management tool.
It allows you to add authentication to applications and secure services with minimum effort.  
No need to deal with storing users or authenticating users in your custom application.  
Keycloak provides user federation, strong authentication, user management, fine-grained authorization, and more.

## _From simple setup to complex use cases_

When looking at your application requirements, Keycloak can handle everything from a simple authentication setup to complex use cases. In this introduction i will explain some of the features of keycloak and how they compare to other products.
And also how to get started with setting up those features.

### 1. Installation
Keycloak is very easy to install. You can download the distribution zip file and extract it. Or use Docker to run Keycloak as a container. In this post we will cover the installation of keyloak using the distribution file on a Windows machine.

1. Download the Keycloak distribution zip file from the [downloads page](https://www.keycloak.org/downloads).
2. Extract the zip file to a folder on your machine.
3. Install a datastore PostgreSQL is preferred but we will also cover MSSQL.
4. Open the bin folder and run standalone.bat to start the Keycloak server. By default it will start on http://localhost:8080/auth
  

These are the basic steps you need to take to install and start the Keycloak server. In the next sections we will dive deeper into configuring Keycloak for your specific use cases.

### 2. Configuration
This will cover the configuration of you local KC instance. For a production setup i will refer to securing and hardening Keycloak.

```bash
bin\kc.bat start
--proxy edge
--hostname-strict=false
--hostname-strict-https=false
--https-port=443
--https-certificate-file=C:\Tools\keycloak-21.1.1\conf\cert.pem
--https-certificate-key-file=C:\Tools\keycloak-21.1.1\conf\key.pem
--log=file
--log-file="c:\temp\kc-server.log"
--log-file-output=json
```

This starts the Keycloak server in a development-ready configuration with HTTPS, hostname validation disabled for development, and logging to file for troubleshooting.

It is however prefered to set these parameters in the configuration file 'keycloak.conf' which can be found in the install location '/conf' folder.



