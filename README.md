# Hosting Grafword Starter SPA on AWS EC2 (Free Tier)

This tutorial will guide you through the steps to host the Grafword Starter SPA on an AWS EC2 instance using the AWS Free Tier.

## Prerequisites

- AWS account (Free Tier eligible)
- Basic knowledge of AWS EC2

## Step 1: Launch an EC2 Instance

1. **Log in to your AWS Management Console.**
2. **Navigate to the EC2 Dashboard:**
   - Click on "Launch Instance."
3. **Configure your instance:**
   - Choose an Amazon Machine Image (AMI), e.g., Ubuntu Server 20.04 LTS.
   - Select an instance type, e.g., t2.micro (eligible for the free tier).
   - Configure instance details and add storage as needed.
4. **Add a key pair:**
   - Create a new key pair or use an existing one. Download the `.pem` file.
5. **Configure security group:**
   - Add a rule to allow HTTP traffic (port 80).
   - Add a rule to allow SSH traffic (port 22).
6. **Launch the instance.**

You can refer to this [YouTube tutorial](https://www.youtube.com/watch?v=0Gz-PUnEUF0) for a detailed walkthrough.

## Step 2: Connect to Your EC2 Instance

1. **Open a terminal on your local machine.**
2. **Change the permissions of your `.pem` file:**

    ```bash
    chmod 400 /path/to/your-key-pair.pem
    ```

3. **Connect to your instance using SSH:**

    ```bash
    ssh -i /path/to/your-key-pair.pem ubuntu@your-ec2-public-dns
    ```

## Step 3: Install and Configure Nginx

1. **Update your package list:**

    ```bash
    sudo apt update
    ```

2. **Install Nginx:**

    ```bash
    sudo apt install nginx -y
    ```

3. **Ensure Nginx is running:**

    ```bash
    sudo systemctl start nginx
    sudo systemctl enable nginx
    ```

4. **Verify Nginx is running:**
   - Open a web browser and navigate to `http://your-ec2-public-dns`. You should see the "Welcome to Nginx!" page, confirming that Nginx is running properly.

## Step 4: Clone the Repository

1. **Clone the repository:**

    ```bash
    git clone https://github.com/throughputer/grafword-starter-spa-aws.git
    ```

## Step 5: Obtain Grafword Credentials

1. **Contact Throughputer admin:**  
   Email your redirect URI/URIs, e.g., `http://your-ec2-public-dns/profile`, to the admin at `info@throughputer.com`. You will receive `clientId` and `grafwordDomain` in response.

## Step 6: Update Application Configuration

1. **On your local machine, update your `script.js` file with the received credentials:**  
   Modify the `script.js` file inside `grafword-starter-spa-aws/public` to include the `clientId` and `grafwordDomain`:

    ```javascript
    const clientId = 'CLIENT_ID';
    const grafwordDomain = 'GRAFWORD_DOMAIN';
    ```
2. **Ensure your `script.js` and other necessary files are ready.**

## Step 7: Upload Your Application Files

1. **Use SCP to upload your files to the EC2 instance:**

    ```bash
    scp -r -i /path/to/your-key-pair.pem /path/to/grafword-starter-spa-aws ubuntu@your-ec2-public-dns:/home/ubuntu/
    ```

    Example:

    ```bash
    scp -r -i ~/Downloads/mykeypair.pem ~/Desktop/grafword-starter-spa-aws ubuntu@your-ec2-public-dns:/home/ubuntu/
    ```

## Step 8: Configure and Run Your Node.js Application

1. **SSH into your EC2 instance (if not already connected):**

    ```bash
    ssh -i /path/to/your-key-pair.pem ubuntu@your-ec2-public-dns
    ```

2. **Navigate to your application directory:**

    ```bash
    cd /home/ubuntu/grafword-starter-spa-aws
    ```

3. **Install Node.js and Forever:**

    ```bash
    sudo apt install nodejs npm -y
    sudo npm install -g forever
    ```

4. **Install application dependencies:**

    ```bash
    npm install
    ```

5. **Start your Node.js application using Forever:**

    ```bash
    forever start server.js
    ```

## Step 9: Configure Nginx as a Reverse Proxy

1. **Open the Nginx configuration file:**

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

2. **Replace the contents with the following configuration:**

    ```nginx
    server {
        listen 80;
        server_name your-ec2-public-dns;

        location / {
            proxy_pass http://localhost:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    Replace `your-ec2-public-dns` with your actual EC2 public DNS.

3. **Test the Nginx configuration:**

    ```bash
    sudo nginx -t
    ```

4. **Restart Nginx to apply the changes:**

    ```bash
    sudo systemctl restart nginx
    ```

## Step 10: Access Your Application

1. **Open a web browser and navigate to:**  
   `http://your-ec2-public-dns`

## Conclusion

Your Grafword Starter SPA should now be up and running on your AWS EC2 instance. You can access it by navigating to `http://your-ec2-public-dns` in your web browser.
