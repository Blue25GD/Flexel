# README

## Deployment

### Requirements:
- An ubuntu server with root access and curl installed.
- (_optional_) A domain name with an SSL proxy (like Cloudflare) to forward traffic to the server.

### Instructions:

Deployment is as simple as running the following command on your server:

```shell
curl -sL https://raw.githubusercontent.com/Blue25GD/Flexel/refs/heads/main/deploy.sh | bash
```

### Accessing the service:

Once the deployment is complete, you can access the service by visiting your domain name in a web browser.

The deployment script automatically starts the web server on port 443 using a self-signed SSL certificate.

WARNING: Flexel **will not work without an HTTPS connection**, any functionality may be broken if accessed over HTTP.