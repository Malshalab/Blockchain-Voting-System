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

3. Follow Instructions in the readme file for ngrok

4. Start your bootnode:
```command-line//
geth --datadir </path/to/data> --networkid <any-custom-network-id> --genesis </path/to/genesis.json> --bootnodes </path/to/bootnodes.json>
```
In our case, our data directory is under this current directory, under the *data* folder. **Make sure not to add this to github**. We can run a node with the following command, assuming we are running this command from inside the project's root directory:
```command-line//
geth --datadir ./blockchain/data --networkid 8920 --genesis ./blockchain/genesis.json --bootnodes ./blockchain/bootnodes.json
```
