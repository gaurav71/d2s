const fs        = require('fs');
const {google}  = require('googleapis');

const TOKEN_PATH        = './config/token.json';
const CREDENTIALS_PATH  = "./config/credentials.json"


module.exports = () => {

    return new Promise((resolve, reject) => {

        fs.readFile(CREDENTIALS_PATH, (err, content) => {
            if (err){
                reject(err);
            } 

            authorize(JSON.parse(content), getGdrive, resolve, reject);
        });
    })


}


function authorize(credentials, callback, resolve, reject) {
    
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err){
            reject(err);
        }

        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client, resolve);

    });
  }



function getGdrive(auth, resolve) {
    const drive = google.drive({version: 'v3', auth});
    resolve(drive);
}