require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

//web3
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/${process.env.INFURA_KEY}`));
const signingAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
const TruffleContract = require('truffle-contract');
const Logger = require('./truffle/build/contracts/Logger.json');
const LoggerContract = TruffleContract(Logger);
if (typeof LoggerContract.currentProvider.sendAsync !== "function") {
    LoggerContract.currentProvider.sendAsync = function() {
        return LoggerContract.currentProvider.send.apply(
            LoggerContract.currentProvider, arguments
        );
    };
}

//initialize our JSON validator with all errors being shown
const validator = new Validator({allErrors: true});
//define a shortcut function
const validate = validator.validate;
// Define a JSON Schema
const JSONSchema = {
    type: 'object',
    required: ['EventType', 'DataLinkType', 'JSONData'],
    properties: {
        EventType: {
            type: 'string'
        },
        DataLinkType: {
            type: 'string'
        },
        JSONData: {
            type: 'object'
        }
    }
};

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/postNewHashToETH', )

app.listen(port, () => console.log(`Example app listening on port ${port}!`));