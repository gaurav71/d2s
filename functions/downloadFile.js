const request   = require("request");
const fs        = require("fs");
const mime      = require('mime-types');

module.exports = (url, fileName, filePath, userId, io) => {

    return new Promise((resolve, reject) => {
        
        const file          = fs.createWriteStream(filePath);
        let mimeType        = "";
        let fileExtension   = "";
        let totalSizeBytes  = 0; 
        let recievedBytes   = 0;

        request.get(url)
            .on("response", (response) => {
            
                if(response.statusCode != 200){
                    reject("not found");
                }
                mimeType        = response.headers["content-type"];
                totalSizeBytes  = response.headers["content-length"];
                fileExtension   = mime.extension(mimeType);  
            })
        

            .on("data", (chunk) => {
                recievedBytes += chunk.length;
                io.sockets.in(userId).emit("downloading", {fileName, totalSizeBytes , recievedBytes})
            })

            .pipe(file)
            
            .on("error", (err) => {
                fs.unlink(filePath);
                reject(err);
            });
        
        

            file.on("finish", () => {
                file.close();
                resolve({
                    name : fileName+"."+fileExtension,
                    extension : fileExtension,
                    size : totalSizeBytes,
                    mimeType
                })
            })

        
            file.on("error", (err) => {
            fs.unlink(filePath);
            reject(err);
            })

            
    })

}

