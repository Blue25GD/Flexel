apt-get update -y
apt-get upgrade -y
apt-get install curl git -y

# clone the repo
git clone https://github.com/Blue25GD/Flexel.git ~/Flexel
cd ~/Flexel

curl https://get.docker.io | bash

rm config/credentials.yml.enc
rm config/master.key

docker build -t flexel .

docker run -d -p 80:80 flexel