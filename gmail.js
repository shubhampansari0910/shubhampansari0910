var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var express = require('express');
var router = express.Router();
var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
var TOKEN_DIR = ('C:/Users/Piyush/Documents/gmail_api/');
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs.json';
var response_path=TOKEN_DIR+'gmail-inbox.txt';
 
var gmail = google.gmail('v1');
router.get('/', async (req, res) =>{
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    res.send('Error loading client secret file: ' + err);
  }
   authorize(JSON.parse(content), getRecentEmail);
  
  res.send("Value of latest 10 inbox mail-body at gmail-inbox.txt");
});
});
router.get('/emailaddress', async (req, res) =>{
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        res.send('Error loading client secret file: ' + err);
      }
       authorize(JSON.parse(content), getRecentEmailaddress);
      res.send("Value of latest 10 Email address is at console");
    });
    });
var authorize= async function (credentials, callback) {
    let clientSecret = credentials.installed.client_secret;
    let clientId = credentials.installed.client_id;
    let redirectUrl = credentials.installed.redirect_uris[0];
    let OAuth2 = google.auth.OAuth2;
    let oauth2Client = new OAuth2(clientId, clientSecret,  redirectUrl);
 
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        getNewToken(oauth2Client, callback);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        return callback(oauth2Client);
      }
    });
};
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({access_type: 'offline', scope: SCOPES});
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
 
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), () => {console.log("callback_success")});
  console.log('Token stored to ' + TOKEN_PATH);
}
function getRecentEmail(auth) {
        const gmail = google.gmail({version: 'v1', auth})
        gmail.users.getProfile({
          userId: 'me'
        }, (err, {data}) => {
          if (err) return console.log('The API returned an error: ' + err)
        })
        gmail.users.messages.list({
            'userId': 'me',
            'labelIds': 'INBOX',
            'maxResults': 10
          },function(err, response) {
            if (err) {
              console.log('The API returned an error: ' + err);
              return;
            }
            let emails=response['data']['messages'];
            for(let value of emails){
            var message_id = value['id'];
            gmail.users.messages.get({auth: auth, userId: 'me', 'id': message_id}, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }  
              message_raw = response.data.payload.parts[0].body.data;
              data = message_raw;  
              buff = Buffer.from(data, 'base64');  
              text = buff.toString();
                  try {
                    fs.mkdirSync(TOKEN_DIR);
                  } catch (err) {
                    if (err.code != 'EEXIST') {
                      throw err;
                    }
                  }
                  fs.appendFile(response_path,text,() => {console.log("response recorded")});
                  
                
              
            });
        }
        });
}
function getRecentEmailaddress(auth) {
    const gmail = google.gmail({version: 'v1', auth})
    gmail.users.messages.list({
        'userId': 'me',
        'labelIds': 'INBOX',
        'maxResults': 10
      },function(err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        let emails=response['data']['messages'];
        for(let value of emails){
        var message_id = value['id'];
        gmail.users.messages.get({auth: auth, userId: 'me', 'id': message_id,}, function(err, response) {
            if (err) {
                console.log('The API returned an error: ' + err);
                return;
            }

            let headers=response.data.payload.headers;
            for(let value of headers){
                if(value.name=='From'){
                    console.log("Email address:",value.value);
                }
            }      
        });
        }
    });
}
module.exports = router;