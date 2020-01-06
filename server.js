const express       = require("express");
const cors          = require("cors");
const cookieParser  = require('cookie-parser');
const passport      = require("passport");
const socketIO      = require("socket.io");
const sharedsession = require("express-socket.io-session");

const config        = require("./config/config");
const auth          = require("./routes/auth");
const download      = require("./routes/download");
const dashboard     = require("./routes/dashboard");
const session       = require("./middleware/session");

const app = express();

const whitelist = [config.reactServer]

const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1)
        callback(null, true)
      else 
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true
}


app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(session);
app.use(passport.initialize());


const {
    PORT = 5000
} = process.env;


const server = app.listen(PORT, () => {
    console.log("server running on "+PORT);
})

var io = socketIO(server);

io.use(sharedsession(session, {
  autoSave:true
})); 


io.on("connection", (socket) => {
    socket.on("join", (val) => {
      socket.join(socket.handshake.session.userId);
    })
})


app.post("/api/download", (req,res,next) => {
    req.IO_Object = io;
    next();
})

app.use("/api/auth", auth);
app.use("/api/dashboard", dashboard);
app.use("/api/download", download);




 

