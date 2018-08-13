# Set-up guide 

This guide will walk through how to set up and deploy a Hyperledger Composer blockchain
and run my webapps on top of it.

On a clean Ubuntu 16.04 installation as root, run the following commands.

We first do some housekeeping:

```bash
apt update -y
apt upgrade -y
apt install -y \
	apt-transport-https \
	bash \
	build-essential \
	ca-certificates \
	curl \
	git \
        iputils-ping \
	python \
	software-properties-common \
	sudo \
	telnet \
    vim
mkdir /home/composer
groupadd composer
useradd -u 12345 -g composer -d /home/composer -s /bin/bash -p $(echo mypasswd | openssl passwd -1 -stdin) composer
usermod -aG sudo composer
chown -R composer:composer /home/composer
su composer
cd
```

Now that we've set up the system, we can begin our Hyperledger installation. First is installing the Composer command-line tools:

```
curl -O https://hyperledger.github.io/composer/latest/prereqs-ubuntu.sh
chmod u+x prereqs-ubuntu.sh
./prereqs-ubuntu.sh
source ~/.nvm/nvm.sh
nvm install --lts
nvm use --lts
npm install -g composer-cli@0.19
npm install -g composer-rest-server@0.19
npm install -g generator-hyperledger-composer@0.19
npm install -g composer-playground@0.19
```
Download Hyperledger Fabric and start the Fabric instance. Note that you will have to run `stopFabric.sh` and `teardownFabric.sh` as well as delete the PeerAdmin and admin cards every time you shut down the machine.

```
mkdir ~/fabric-dev-servers && cd ~/fabric-dev-servers
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/fabric-dev-servers.tar.gz
tar -xvf fabric-dev-servers.tar.gz
cd ~/fabric-dev-servers
export FABRIC_VERSION=hlfv11
./downloadFabric.sh
./stopFabric.sh 
./teardownFabric.sh

composer card delete -c PeerAdmin@fabric-network
composer card delete -c admin@tutorial-network

./startFabric.sh
./createPeerAdminCard.sh
```

Clone [my Github repo](https://github.com/lieuzhenghong/blockchain_showcase.git) to get the web apps (blockchain visualiser, asset tracker, REST endpoint).

```
cd ~/dev
git clone https://github.com/lieuzhenghong/blockchain_showcase.git
```

Now, install the PeerAdmin and NetworkAdmin cards, and start the Composer network!

```
composer network install --card PeerAdmin@hlfv1 --archiveFile tutorial-network@0.0.1.bna
composer network start --networkName tutorial-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

composer card import --file networkadmin.card
composer-rest-server -c admin@tutorial-network -n never -w true
```
The output should say something like `REST server running on localhost:3000`; check if everything is working.

Finally, run the web apps I have created:
```
source ~/.nvm/nvm.sh
nvm use --lts
node server.js
```