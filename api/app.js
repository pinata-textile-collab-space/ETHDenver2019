require('dotenv').config({ path: './api/.env' })
const express = require('express');
const ethers = require('ethers');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3002;
const { Validator, ValidationError } = require('express-json-validator-middleware');

const Web3 = require('web3');

let infuraProvider = new ethers.providers.InfuraProvider('kovan', process.env.INFURA_KEY);
const build = require('./truffle/build/contracts/Logger.json');

const abi = build.abi;
const contractAddress = '0x074d32dCCad3E3dD9C383900dfdfbBA366861f6F';

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, infuraProvider);

let contract = new ethers.Contract(contractAddress, abi, infuraProvider);

const contractWithSigner = contract.connect(wallet);

const web3 = new Web3(new Web3.providers.HttpProvider(`${process.env.INFURA_KEY}`));

//initialize our JSON validator with all errors being shown
const validator = new Validator({allErrors: true});
//define a shortcut function
const validate = validator.validate;
// Define a JSON Schema
const JSONSchema = {
    type: 'object',
    required: ['EventType', 'DataLink', 'DataLinkType'],
    properties: {
        EventType: {
            type: 'string'
        },
        DataLink: {
            type: 'string'
        },
        DataLinkType: {
            type: 'string'
        }
    }
};

app.use(cors());
app.use(bodyParser.json({limit: '200mb'}));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/postNewHashToETH', validate({ body: JSONSchema }), async function(req, res) {
   const jsonBody = req.body;

    jsonBody.timeStamp = Date.now();

    if(jsonBody.DataLinkType !== 'IPFS') {
        return res.status(400).json({
            error: `At this time, IPFS is the only data storage medium supported for "DataLinkType"`
        });
    }

    const eventId = web3.utils.asciiToHex(req.body.EventId);
    const eventType = web3.utils.asciiToHex(req.body.EventType);
    const dataLink = req.body.DataLink; //the ipfs hash
    const dataLinkType = web3.utils.asciiToHex(req.body.DataLinkType);

    let tx = await contractWithSigner.recordEvent(eventId,eventType, dataLink, dataLinkType);

    tx.wait().then(() => {
        return res.status(200).json({
            eventEmitted: {
                EventSource: wallet.address,
                EventId: jsonBody.EventId,
                EventType: jsonBody.EventType,
                DataLink: jsonBody.DataLink,
                DataLinkType: jsonBody.DataLinkType,
                TimeStamp: jsonBody.timeStamp
            }
        });
    }).catch((err) => {
        return res.status(400).json({
            error: err
        });
   });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));