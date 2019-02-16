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
    required: ['EventType', 'DataLink', 'DataLinkType', 'JSONData'],
    properties: {
        EventType: {
            type: 'string'
        },
        DataLink: {
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

app.post('/postNewHashToETH', validate({ body: JSONSchema }), function(req, res) {
   const jsonBody = req.body;

    if(jsonBody.EventId) {
        if(jsonBody.EventId.length > 32 || !isAlphanumeric(jsonBody.EventId)) {
            return res.status(400).json({
                error: `EventId must be less than or equal to 32 alpha-numeric characters in length`
            });
        }
    } else {
        //generate a random 32 length alpha-numeric string to use as the EventId
        jsonBody.EventId = crypto.randomBytes(32).toString('hex');
    }

    jsonBody.timeStamp = Date.now();

    if(jsonBody.DataLinkType !== 'IPFS') {
        return res.status(400).json({
            error: `At this time, IPFS is the only data storage medium supported for "DataLinkType"`
        });
    }

    LoggerContract.deployed().then( function(instance) {
        const theContract = new web3.eth.Contract(instance.abi, instance.address);

        const eventId = web3.utils.asciiToHex(req.body.EventId);
        const eventType = web3.utils.asciiToHex(req.body.EventType);
        const dataLink = req.body.DataLink; //the ipfs hash
        const dataLinkType = web3.utils.asciiToHex(req.body.DataLinkType);

        const payload = theContract.methods.recordEvent(eventId, eventType, dataLink, dataLinkType).encodeABI();
        const transactionObject = {
            from: signingAccount.address,
            to: instance.address,
            gas: 670000,
            gasPrice: web3.utils.toWei("20","gwei"),
            data: payload
        };

        web3.eth.accounts.signTransaction(transactionObject, signingAccount.privateKey).then((signedTransaction) => {
            web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).then(() => {
                return res.status(200).json({
                    eventEmitted: {
                        EventSource: signingAccount.address,
                        EventId: jsonBody.EventId,
                        EventType: jsonBody.EventType,
                        DataLink: jsonBody.DataLink,
                        DataLinkType: jsonBody.DataLinkType,
                        TimeStamp: jsonBody.timeStamp
                    }
                });
            }).catch((error) => {
                return res.status(400).json({
                    error: `${error}`
                });
            })
        }).catch((error) => {
            return res.status(400).json({
                error: `${error}`
            });
        });
    });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));