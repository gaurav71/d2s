const router        = require("express").Router();
const fs            = require("fs");
const request       = require("request");
const url           = require("url");
const path          = require("path");
const mime          = require('mime-types');

const checkAuth     = require("../middleware/checkAuth");
const downloadFile  = require("../functions/downloadFile");
const setupGdrive   = require("../functions/gdrive");

const getValidName = (fileUrl) => {
    var name = path.basename(url.parse(fileUrl).path);
    name = name.replace(/\s/g,"_");
    name = name.replace(/[^A-Z0-9a-z_-]/g, "");
    name = name.slice(0, Math.min(15,name.length));
    return name;
}


const getFileDetails = (fileUrl) => {
    return new Promise((resolve, reject) => {
        const r = request.get(fileUrl)
        .on('response', (response) => {
            const type = response.headers["content-type"];
            const size = response.headers["content-length"];
            const ext  = type ? mime.extension(type) : null;
            var name   = getValidName(fileUrl);
            if(ext){
                name += "." + ext;
            }
            r.abort();
            resolve({name, type, size, ext})
        })
        .on("error", (error) => {
            reject(error);  
        })
    })
}


router.post("/getFileDetails", checkAuth, async(req, res) => {
    try{
        const fileDetails = await getFileDetails(req.body.url);
        res.json(fileDetails);
    }
    catch(error){
        return res.status(500).json({"error" : "could not download"});
    }
})


// @@ROUTE :: /api/download/
router.post("/", checkAuth, async (req,res) => {
    
    const io            = req.IO_Object;
    const {url}         = req.body;
    const fileDetails   = await getFileDetails(url);
    fileDetails.path    = "./files/"+fileDetails.name;

    try{
        const gdrive = await setupGdrive();
        
        await downloadFile(url, fileDetails, req.session.userId, io);

        io.in(req.session.userId).emit("uploading");

        await gdrive.files.create({
            requestBody: {
                name: fileDetails.name,
                mimeType: fileDetails.type
            },
            media: {
                mimeType: fileDetails.type,
                body: fs.createReadStream(fileDetails.path)
            }
        });

        fs.unlink(fileDetails.path, ()=> {});

        return res.json({"success" : "file uploaded to gdrive"});

    }

    catch(error){
        io.sockets.socket(req.session.userId).disconnect();
        fs.unlink(fileDetails.path, ()=> {});
        return res.status(500).json({"error" : "could not download"});
    }
    
})

module.exports = router;
