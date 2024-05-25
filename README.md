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

ssh -i "web_rtc_chat_key_pair.pem" ec2-user@ec2-3-70-45-17.eu-central-1.compute.amazonaws.com

# 1
sudo yum update -y
sudo yum install git -y
curl -fsSL https://rpm.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo bash nodesource_setup.sh
sudo yum install -y nodejs
sudo npm install --global yarn
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
nano server.ts
yarn dev




3.70.45.17-key.pem  README.md                  node_modules  public  tsconfig.json
3.70.45.17.pem      mkcert-v1.4.4-linux-amd64  package.json  src     yarn.lock
