# README

## Deployment

### Requirements:
- An ubuntu server with root access and curl installed.
- A domain name proxied through cloudflare or an ssl proxy with your domain name.

### Instructions:

Deployment is as simple as running the following command on your server:

```shell
curl -sL https://raw.githubusercontent.com/Blue25GD/Flexel/refs/heads/main/deploy.sh | bash
```

### Accessing the service:

Once the deployment is complete, you can access the service by visiting your domain name in a web browser.

The deployment script automatically starts the web server on port 80 and your proxy needs to be configured to forward traffic to the server. **It will not work without SSL**