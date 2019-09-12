
let callbackUrl = chrome.extension.getURL("oauth.html"); // your endpoint
let oauthToken = "";
let oauthTokenSecret = "";
let access_token = "";

// initialize OAuth
let Evernote = require('evernote');
let client;

let authorizeNoteApp = () => {
      client = new Evernote.Client({
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
      
          chrome.storage.local.set({
              'authenticated': true,
              'temp_token': token,
              'temp_secret': tokenSecret
            }, () => {
                console.log("Authentication status set to: " + status);
                window.location.href = client.getAuthorizeUrl(oauthToken); // send the user to Evernote
          });
    });
};

let initializeNoteInfo = () => {
    client = new Evernote.Client({
        token: access_token,
        sandbox: true,
        china: true,
        serviceHost: "sandbox.yinxiang.com"
    });

    let globalNoteStore = client.getNoteStore();

    globalNoteStore.listNotebooks().then((notebooks) => {
      // notebooks is the list of Notebook objects
      $('.ever-notebook-select').find('option').remove().end().append('<option value="default">未选择任何笔记本</option>').val('default');
      notebooks.forEach(book => {
        $('.ever-notebook-select').append(new Option(book.name, book.guid));
      });
      
    });
};


$(() => {
    //Only if access token is empty.
    chrome.storage.local.get([
      'access_token'
    ], (items) => {
      if (!items['access_token']) {
        $('#authorize-btn').click(() => {
          authorizeNoteApp();
          initializeNoteInfo();
        }).removeClass('hide-element');
      } else {
        access_token = items['access_token'];
        $('.evernote-container').removeClass('hide-element');
        // Load notebooks and notes
        initializeNoteInfo();
      }
    });
   $('.options-save').click(() => {
      let noteType = $('.storage-type-select').val() || 'evernote';
      let targetBook = $('.ever-notebook-select').val() || 'default';
      chrome.storage.local.set({
        'noteType': noteType,
        'targetBook': targetBook
      }, () => {
        alert("Note type set to: " + noteType);
      });
   });
});