# web_rtc_chat

For local development with HTTPS you need to install mkcert:
```$ brew install mkcert```

Create a local CA and create certificate for localhost:
```
$ mkcert -install
$ mkcert localhost
```

Start for development
```$ yarn start```

# SETUP AWS SERVICE
## connect to AWS EC2
```
ssh -i "web_rtc_chat_key_pair.pem" ec2-user@ec2-3-70-45-17.eu-central-1.compute.amazonaws.com
```
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
# Install necessary programs on AWS EC2:
### 1) update all install packages
`sudo yum update -y`
### 2) Install GIT:
`sudo yum install git -y`
### 3) Install nodejs:
```
curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo yum install nodejs -y
```
### 4) Install yarn:
`sudo npm install --global yarn`
### 5) Install pm2:
`sudo npm install pm2@latest -g`
### 6) Install mkcert:
```
sudo yum install nss-tools -y
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
sudo yum update -y
sudo yum install git -y
curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo yum install nodejs -y
sudo npm install --global yarn
sudo npm install pm2@latest -g
sudo yum install nss-tools -y
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

git clone https://github.com/kvark85/web_rtc_chat.git
cd web_rtc_chat/
yarn install
mkcert -install
mkcert 3.70.45.17
cd ./src
start "yarn start"
pm2 save
pm2 startup systemd
команду что даст
pm2 status
sudo reboot
pm2 stop 0
pm2 start 0

