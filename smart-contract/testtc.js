// truffle-config.js

module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",     // Localhost (Ganache)
            port: 7545,            // Ganache Ethereum port for local dev
            network_id: "*",       // Match any network id
        },

        // Uncomment and configure if you want to deploy to testnets
        // goerli: {
        //   provider: () =>
        //     new HDWalletProvider(
        //       "your mnemonic here",
        //       "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"
        //     ),
        //   network_id: 5,
        //   gas: 5500000,
        //   confirmations: 2,
        //   timeoutBlocks: 200,
        //   skipDryRun: true,
        // },
    },

    compilers: {
        solc: {
            version: "0.8.0", // Use Solidity 0.8.0
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200,
                },
            },
        },
    },

    // You can set default mocha options here
    mocha: {
        // timeout: 100000
    },
};
