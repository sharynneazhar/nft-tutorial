const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET_KEY;
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');

const pinFileToIPFS = async () => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  let data = FormData();

  data.append(
    'file',
    fs.createReadStream(path.resolve(__dirname, '..', process.argv[2]))
  );

  const pinataResult = await axios.post(url, data, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });

  console.log('Asset upload successful', pinataResult.data);
};

pinFileToIPFS();
