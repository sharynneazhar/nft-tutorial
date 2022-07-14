const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET_KEY;

const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const Web3 = require('web3');
const contract = require('@truffle/contract');

const host = process.env.HOST || '127.0.0.1';

const provider = new Web3(
  new Web3.providers.HttpProvider(`http://${host}:8545`)
);

const artifact = require('../build/contracts/NFT.json');
const NFTContract = contract(artifact);
NFTContract.setProvider(provider.currentProvider);

const mintNFT = async () => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  let data = FormData();

  data.append(
    'file',
    fs.createReadStream(path.resolve(__dirname, '..', process.argv[3]))
  );

  const pinataResult = await axios.post(url, data, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  console.log('Metadata upload successful', pinataResult.data);

  const accounts = await provider.eth.getAccounts();
  const nft = await NFTContract.deployed();

  const nftResult = await nft.awardItem(
    process.argv[2],
    pinataResult.data.IpfsHash,
    JSON.stringify(pinataResult.data),
    { from: accounts[1] }
  );

  console.log('Minted', nftResult);
};

mintNFT();
