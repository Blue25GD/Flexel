# README

## Deployment

### Requirements:
- An ubuntu server with root access and curl installed.
- (optional but highly recommended) A domain name with an SSL proxy (like Cloudflare) to forward traffic to the server.

### Instructions:

Deployment is as simple as running the following command on your server:

```shell
curl -sL https://raw.githubusercontent.com/Blue25GD/Flexel/refs/heads/main/deploy.sh | bash
```

### Accessing the service:

Once the deployment is complete, you can access the service by visiting your domain name in a web browser.

The deployment script automatically starts the web server on port 443 using a self-signed SSL certificate. 
If you want to forward traffic using Cloudflare, make sure to set the SSL encryption mode to "Full", 
otherwise Cloudflare might reject your requests.

WARNING: Flexel **will not work without an HTTPS connection**, any functionality may be broken if accessed over HTTP.
Flexel will also not work with Cloudflare's "Flexible" SSL encryption mode.