/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

require('dotenv').config({path: './../.env'});
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*"
        },
        kovan:  {
            provider: function() {
                return new HDWalletProvider(mnemonic, `https://kovan.infura.io/${process.env.MNEMONIC}`);
            },
            network_id: 42,
            gas: 1698712,
            gasPrice: 65000000000
        },
    }
};
