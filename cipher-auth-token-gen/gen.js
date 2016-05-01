'use strict'
//  usage:
//    node gen.js <FIREBASE_SECRET> <cipher key>

var utils = require('./utils');
var FirebaseTokenGenerator = require('firebase-token-generator');

if(process.argv.length < 4){
  console.log("usage: node gen.js <FIREBASE_SECRET> <CIPHER_KEY>");
  process.exit(0);
}

var FIREBASE_SECRET = process.argv[2];
var CIPHER_KEY = process.argv[3];
var tokenGenerator = new FirebaseTokenGenerator(FIREBASE_SECRET);

var expiryDate = new Date('2016-06-03');
var expirySeconds = expiryDate.getTime()/1000;

var token = tokenGenerator.createToken({uid: 'firebase-browser'}, {admin : true, expires : expirySeconds});
var cipherToken = utils.encryptAES(token, CIPHER_KEY);
console.log(cipherToken);