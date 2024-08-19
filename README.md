# Hosting Grafword Starter Web App on AWS EC2 (Free Tier)

### This tutorial will guide you through the steps to host the Grafword Starter Web App on an AWS EC2 instance using the AWS Free Tier.

##  What is Grafword?

Grafword is an advanced Single Sign-On (SSO) solution designed for modern web applications, including Single Page Applications (SPAs). It utilizes AI-powered, graphics-based strong authentication to enhance security. Grafword ensures the use of 128-character cryptic passwords, providing superior protection against brute-force attacks. It replaces traditional password fields with graphical authentication, offering both security and convenience for users and app operators. The system continuously monitors login sessions to adapt authentication challenges, maintaining robust security without compromising the user experience in SPAs.

To learn more, visit [Grafword](https://grafword.com). 

To see Grafword in action, visit [Grafword SSO](https://login.grafword.com)

## Prerequisites

- [AWS](https://aws.amazon.com/) account (Free Tier eligible)
- Basic knowledge of AWS EC2

## Step 1: Launch an EC2 Instance

1. **Log in to your AWS Management Console.**
2. **Navigate to the EC2 Dashboard**
3. **Click on "Launch Instance."**
4. **Configure your instance:**
    - Name your instance.
    - Choose an AMI: Select a machine with a Ubuntu OS, such as Ubuntu Server 20.04 LTS.
    - Select an Instance Type: Choose `t2.micro` (eligible for the AWS Free Tier).
         
    - **Add/Create a Key Pair:**
        - During the instance creation process, you will see an option to "Create a new key pair" or "Select an existing key pair"

        - Click on "Create a new key pair".
        - Enter a name for your key pair, e.g., `grafword_spa` and click on "Create key pair".
        - The `.pem` file will be automatically downloaded to your default download folder. Move it to your .ssh folder:

        ```bash
        mv ~/Downloads/grafword_spa.pem ~/.ssh/grafword_spa.pem
        ```

    - **Configure Security Group:** 
         - Add rules to allow HTTP traffic (port 80) and SSH traffic (port 22).
         - For a visual guide on configuring security groups [This short clip can be helpful](https://youtu.be/0Gz-PUnEUF0?si=10JUG08OwzTUitjW&t=292).
    - **Leave the rest as it is.**

5. **Launch the Instance:**
    - Click on `Launch instance`.
    - If you see `Success`, that means you successfully created an instance!

6. **View Instance Details:**
    - Scroll down and click `View all instances`. Refresh the page if you don't see your new instance.
    - Wait until the **Instance State** shows `running` and the **Status Checks** indicate `2/2 checks passed`. Refresh page as needed.
    - Select the instance to view your `Public_IPv4_DNS`. Which will be used to connect to your ec2. 
    - *`Public_IPv4_DNS` might change upon restarting the instance.*
 - This [YouTube tutorial](https://www.youtube.com/watch?v=0Gz-PUnEUF0) provide a more detailed walkthrough to create an EC2 instance.

## Step 2: Email your redirect URI/URIs

Redirect URI is the uri the user will be redirected to after successfully logging in with Grafword with your app. The starter app uses /profile as the redirect URI. To ensure proper setup, follow these steps: 

1. **Prepare Your Redirect URI:**
    - Replace Public_IPv4_DNS with your actual EC2 public DNS in the following URI:
        ```bash
        http://Public_IPv4_DNS/profile
        ```

        For example, if your EC2 public DNS is ec2-01-23-456-789.compute-1.amazonaws.com, your redirect URI will be:

        ```bash
        http://ec2-01-23-456-789.compute-1.amazonaws.com/profile
        ```


2. **Send Your Redirect URI to the Admin:**
    - Email the redirect URI to the admin at info@throughputer.com.
    - In your email, specify that this is the redirect URI for your application.

3. **Await Response:**
    - You will receive `clientId` and `grafwordDomain` in response, which are necessary for completing the setup of your application.

    - You can send additional redirect URIs to info@throughputer.com if you add more pages, such as `http://Public_IPv4_DNS/settings` or `http://Public_IPv4_DNS/dashboard`. You can also let us know when your `Public_IPv4_DNS` changes.

   
## Step 3: Connect to your EC2 Instance

1. **On your local terminal, change the permissions of the `.pem` file you downloaded at `step 1` when creating your instance:**

    ```bash
    chmod 400 ~/.ssh/grafword_spa.pem
    ```

2. **Connect to your instance using SSH:**

    ```bash
    ssh -i ~/.ssh/grafword_spa.pem ubuntu@Public_IPv4_DNS
    ```

    Replace `Public_IPv4_DNS` with your actual EC2 public DNS. For example:
    ```bash
    ssh -i ~/.ssh/grafword_spa.pem ubuntu@ec2-01-23-456-789.compute-1.amazonaws.com
    ```
    - You will be asked `Are you sure you want to continue connecting (yes/no/[fingerprint])?`, type `yes` and Enter.

- If the connection is successful, your terminal prompt should change to something like this: `ubuntu@ip-172-31-XX-XX:~$`


## Step 4: Install and Configure Nginx

**Still on your AWS instance via SSH:** 

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

4. **In your local web browser, verify Nginx is running:**
   - Navigate to `http://Public_IPv4_DNS`. *It may take several seconds.* But you should see the "Welcome to Nginx!" page. 

## Step 5: Clone the Repository

1. **On your AWS instance (via SSH), clone the repository by running:**
 
    ```bash
    git clone https://github.com/throughputer/grafword-starter-spa-aws.git
    ```

2. **Create a `.env` file with the following:**
    ```bash
    cd grafword-starter-spa
    echo -e "CLIENT_ID=client_id_here\nGRAFWORD_DOMAIN=grafword_domain_here" > .env
    ```
    Replace `client_id_here` and `grafword_domain_here` with the actual values you received from Throughputer. For example:

    ```bash
    echo -e "CLIENT_ID=abc123\nGRAFWORD_DOMAIN=example.com" > .env
    ```

## Step 6: Configure and Run your Application on your AWS Instance

**While still in your root directory `grafword-starter-spa-aws`**

1. **Install Node.js and Forever:**

    ```bash
    sudo apt install nodejs npm -y
    sudo npm install forever -g
    npm install
    ```
2. **Start your Node.js application using Forever:**

    ```bash
    npm start
    ```

    - You can also use `forever list` to view your running process. `npm run stop` to stop the process.`npm run restart` to restart.

## Step 7: Configure Nginx as a Reverse Proxy

1. **Update the Nginx Configuration Using the Template:**
- Your project includes a file named `nginx.conf.template`, which contains the basic Nginx configuration. This template uses a placeholder {{server_name}} where your EC2 public DNS should be. 

- Replace the `{{server_name}}` placeholder in the template with your actual EC2 public DNS, and then write the updated configuration to the appropriate Nginx configuration file with the following command:

    ```bash
    sed 's/{{server_name}}/Public_IPv4_DNS/g' nginx.conf.template | sudo tee /etc/nginx/sites-available/default > /dev/null
    ```


    For example, if your EC2 public DNS is e`c2-01-23-456-789.compute-1.amazonaws.com`, you would use the following command:
    ```bash
    sed 's/{{server_name}}/ec2-01-23-456-789.compute-1.amazonaws.com/g' nginx.conf.template | sudo tee /etc/nginx/sites-available/default > /dev/null
    ```

2. **Test the Nginx configuration:**

    ```bash
    sudo nginx -t
    ```
    You should see `nginx: configuration file /etc/nginx/nginx.conf test is successful`

3. **Restart Nginx to apply the changes:**

    ```bash
    sudo systemctl restart nginx
    ```
    Give it a minute or two to load.

## Step 9: Access Your Application

1. **Open your local web browser and navigate to:**  
   `http://Public_IPv4_DNS` to access your Grafword Starter SPA.

   Example: `http://http://ec2-01-23-456-789.compute-1.amazonaws.com`

## Conclusion

Grafword SSO provides an out-of-the-box secure, password-less user account management system. This starter app, gets you off and running
with your next "killer app" with a Grafword-based secure login solution already in place.
