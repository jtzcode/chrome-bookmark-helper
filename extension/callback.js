//read query string to store access token with oauth_verifier
console.log("Getting access token...");
let Evernote = require('evernote');
let client = new Evernote.Client({
    consumerKey: 'jaxpression-7658',
    consumerSecret: '784a540726be2a0f',
    sandbox: false, // change to false when you are ready to switch to production
    china: true, // change to true if you wish to connect to YXBJ - most of you won't
    serviceHost: "sandbox.yinxiang.com"
});

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

let queries = getUrlVars();
let verifier = queries["oauth_verifier"];

document.getElementById('return').attributes['href'] = chrome.extension.getURL('options.html');
chrome.storage.local.get([
    'temp_token',
    'temp_secret'
], (items) => {
    client.getAccessToken(items['temp_token'],
        items['temp_secret'],
        verifier,
        function(error, oauthToken, oauthTokenSecret, results) {
            if (error) {
                // do your error handling
            } else {
                // oauthAccessToken is the token you need;
                chrome.storage.local.set({
                    'access_token': oauthToken
                  }, () => {
                    console.log("Access token updated.");
                });
            }
    }); 
});