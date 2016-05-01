//  usage:
//    node test.js <CIPHERED_TOKEN> <CIPHER_KEY> <FIREBASE_DB_NAME>

if(process.argv.length < 5){
  console.log("node test.js <FIREBASE_DB_NAME> <CIPHER_KEY> <CIPHERED_TOKEN> ");
  console.log("e.g node test.js shining-inferno-4918 hello 'U2FsdGVkX1+9IzYDVmNaiU4u89S3Aopu'");
  process.exit(0);
}

var utils = require('./utils');
var Firebase = require('firebase');

var FIREBASE_DB_NAME = process.argv[2];
var CIPHER_KEY = process.argv[3];
var CIPHERED_TOKEN = process.argv[4];

var token = utils.decryptAES(CIPHERED_TOKEN, CIPHER_KEY);

var ref = new Firebase('https://' + FIREBASE_DB_NAME + ".firebaseio.com");
ref.authWithCustomToken(token, function(err, auth){
  if(err){
    console.log("error : %j", err);
  }
  else{
    console.log("success : %j" , auth);
    if(!auth.expires){
      console.log("NO expiry");
    }
    else{
      var expiry = new Date(auth.expires*1000);
      console.log("expiry = " + expiry);
    }
  }
  process.exit(0);
});