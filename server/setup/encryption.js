const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = '5eb63d320b1a2c1306a6f8d3fe3abc5d'
const ivLength = 16; // bytes

const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (encrypted) => {
    console.log(encrypted)
    const parts = encrypted.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const content = Buffer.from(parts.join(':'), 'hex');

    console.log(parts)
    if (parts.length !== 2) {
        throw new Error('Invalid encrypted string. Should contain IV and content separated by a colon.');
    }

   if (iv.length !== 16) {
            throw new Error('Invalid IV length. Should be 16 bytes.');
   }

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
