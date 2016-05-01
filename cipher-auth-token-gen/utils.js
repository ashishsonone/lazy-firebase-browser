var CryptoJS = require('crypto-js');

function encryptAES(message, key){
  return CryptoJS.AES.encrypt(message, key).toString();
}

function decryptAES(message, key){
  var bytes  = CryptoJS.AES.decrypt(message, key);
  var plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

module.exports = {
  encryptAES : encryptAES,
  decryptAES : decryptAES
};