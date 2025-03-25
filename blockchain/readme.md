# Blockchain

A few things to note. If we want to save the state of our blockchain and restart the network later, we can store that state in a data directory. However, if we are to at any point change our enode addresses, the entire network will need to be restarted (see the readme ngrok for more info). 

## Setup Steps for an Ethereum Node (Current instructions for MacOS/Linux)

1. Install geth\
With homebrew:
```command-line//
brew install geth
```

2. Verify geth works
```command-line//
geth --version
```

3. Create an Ethereum Key Pair: 
```command-line//
geth account new --datadir <path-to-your-ethereum-acccount-data-directory>
```
<!-- The keystore for your account will be in the directory above. **Make sure not to add it to git**. -->
4. Start the Geth Console:
```command-line//
geth --datadir <path-to-your-ethereum-acccount-data-directory> console
```

5. Run the Following Command In Your Ethereum Console:
```command-line//
admin.nodeInfo.enode
```
You will see an output like this: 
```console//
> admin.nodeInfo.enode
"enode://6b6675cf7a22d0863c31c9db85ea2468d86330f1fdd08f1d5d7245a2cd485526bbfce8b8d4d044eafc8c3da25ae900a852592686b523da6c50a0024982c62a1c@38.70.163.199:30303?discport=23921"
```
This will display the node address in the format: `"enode://\<public-key\>@\<IP-address\>:\<PortNumber\>"

Copy the public key above and save it for later

6. Follow Instructions in the readme file for ngrok

7. Once complete, modify the bootnodes.json file to include the public key we saved from step 5

8. Start your bootnode:
```command-line//
geth --datadir </path/to/data> --networkid <any-custom-network-id> --genesis </path/to/genesis.json> --bootnodes </path/to/bootnodes.json>
```
In our case, our data directory is under this current directory, under the *data* folder. **Make sure not to add this to git**. We can run a node with the following command, assuming we are running this command from inside the project's root directory:
```command-line//
geth --datadir ./blockchain/data --networkid 8920 --genesis ./blockchain/genesis.json --bootnodes ./blockchain/bootnodes.json
```
