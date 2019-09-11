
var callbackUrl = chrome.extension.getURL("oauth.html"); // your endpoint
let oauthToken = "";
let oauthTokenSecret = "";

// initialize OAuth
var Evernote = require('evernote');
const https = require('https');

var client = new Evernote.Client({
  consumerKey: 'jaxpression-7658',
  consumerSecret: '784a540726be2a0f',
  sandbox: false, // change to false when you are ready to switch to production
  china: true, // change to true if you wish to connect to YXBJ - most of you won't
  serviceHost: "sandbox.yinxiang.com"
});

client.getRequestToken(callbackUrl, function(error, token, tokenSecret) {
    console.log(callbackUrl);
    if (error) {
      // do your error handling here
    }
    // store your token here somewhere - for this example we use req.session
    console.log(token + " " +  tokenSecret)
    oauthToken = token;
    oauthTokenSecret = tokenSecret;
    window.location.href = client.getAuthorizeUrl(oauthToken); // send the user to Evernote
  });



/* client.getAccessToken(req.session.oauthToken,
  req.session.oauthTokenSecret,
  req.query.oauth_verifier,
function(error, oauthToken, oauthTokenSecret, results) {
  if (error) {
    // do your error handling
  } else {
    // oauthAccessToken is the token you need;
    var authenticatedClient = new Evernote.Client({
      token: oauthToken,
      sandbox: true,
      china: false,
    });
    var noteStore = authenticatedClient.getNoteStore();
    noteStore.listNotebooks().then(function(notebooks) {
      console.log(notebooks); // the user's notebooks!
    });
  }
}); */

let authorizeNoteApp = () => {

};


$(() => {

});