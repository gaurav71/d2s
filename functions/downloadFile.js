const request   = require("request");
const fs        = require("fs");
const mime      = require('mime-types');

module.exports = (url, fileDetails, userId, io) => {

    return new Promise((resolve, reject) => {
        console.log(fileDetails);
        const file          = fs.createWriteStream(fileDetails.path);
        let recievedBytes   = 0;

        request.get(url)
            .on("response", (response) => {
                if(response.statusCode != 200){
                    reject("not found");
                }
            })
    
            .on("data", (chunk) => {
                recievedBytes += chunk.length;
                io.in(userId).emit("downloading", recievedBytes);
            })

            .pipe(file)
            
            .on("error", (err) => {
                fs.unlink(fileDetails.path, ()=>{});
                reject(err);
            });
        
        
            file.on("finish", () => {
                file.close();
                resolve();
            })

        
            file.on("error", (err) => {
                fs.unlink(fileDetails.path, ()=>{});
                reject(err);
            })

            
    })

}

