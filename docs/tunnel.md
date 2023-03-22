
## Introduction

This application's API uses the pubsub pattern to decouple certain operations like sending emails. This in addition to the API's compute (Cloud run) which scales to 0 causes a bit of an issue with pubsub since we can't use pull-based subscriptions since the API won't be able to pull messages if it's not running.


Therefore, I decided to use Cloud Pub/Sub push subscriptions which allows us to send a message to a pubsub topic and have the pubsub service send a POST request to a URL of our choice.


The next issue was working locally. Cloud Pub/Sub has an emulator which allows us to replicate pub/sub in our development environment. I've not tested it but from what I read from the docs, it supports push-endpoints but you it's cumbersome to use since there's a lot of setup needed like getting the environment variables and creating the topics, subscriptions, etc using the client library.


This was unideal for me since it creates a lot of extra code and steps just to get it working locally and still won't work if the service publishing messages is deployed in the cloud. This meant that some workflows like signed urls, which triggers a cloud function to process the images then publishes a message back to the main api to save the state to the database won't work


## Solution

The solution I've found is to expose a local endpoint that can be used as a push-endpoint. Using something like ngrok we could utilize push-endpoints for development exactly the way we would for production by just changing the url. This solves both issues mentioned above


### Cloudflare tunnel

I've settled on cloudflare for this since it's free and easy to use. It's also a lot more secure than other random services out there and we only have to setup the sub-domain once unlike ngrok which changes the url everytime unless you pay for the pro tier


To setup cloudflare tunnel, I recommend following the [steps](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/remote/) for setting it up using the dashboard

#### Setting public hostname

This is part of the docs but in order to set up a public hostname, just set the ff:
- subdomain that you would like to use: `mp_dev_api` 
- domain: any of the domains you have in cloudflare (`mplibunao.tech`)
- service: Protocol (http/s, tpc, ssh, etc). Most likely `http`
- url: the url of the service you want to expose. `http://localhost:4000` or whatever you're using when developing

![cloudflare tunnel public hostname](./cloudflare-tunnel.png)

#### Updating terraform

1. Update the pubsub url for your dedicated dev environment
