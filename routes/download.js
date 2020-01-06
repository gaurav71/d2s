const router        = require("express").Router();
const fs            = require("fs");

const checkAuth     = require("../middleware/checkAuth");
const downloadFile  = require("../functions/downloadFile");
const setupGdrive   = require("../functions/gdrive");



    // @@ROUTE :: /api/download/
    router.post("/", checkAuth, async (req,res) => {

        
        const io        = req.IO_Object;
        const {url}     = req.body;
        const fileName  = "temp"+Date.now();
        const filePath  = "./files/"+fileName;
    
        try{

            const gdrive    = await setupGdrive();
            const file      = await downloadFile(url, fileName, filePath, req.session.userId, io);

            io.sockets.in(req.session.userId).emit("uploading");

            await gdrive.files.create({
                requestBody: {
                    name: file.name,
                    mimeType: file.mimeType
                },
                media: {
                    mimeType: file.mimeType,
                    body: fs.createReadStream(filePath)
                }
            });

            fs.unlink(filePath, ()=> {});

            return res.json({"success" : "file uploaded to gdrive"});

        }

        catch(error){
            fs.unlink(filePath, ()=> {});
            return res.status(500).json({"error" : "could not download"});
        }
        
    })

    module.exports = router;
