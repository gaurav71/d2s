const express       = require("express");
const cors          = require("cors");
const cookieParser  = require('cookie-parser');
const passport      = require("passport");

const auth          = require("./routes/auth");
const download      = require("./routes/download");
const dashboard     = require("./routes/dashboard");
const session       = require("./middleware/session");

const app = express();

const whitelist = ["http://localhost:3000"]

const corsOptions = {
    origin: function(origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1)
        callback(null, true)
      else 
        callback(new Error('Not allowed by CORS'))
    },credentials: true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(session);
app.use(passport.initialize());

app.use((req,res,next)=>{
  console.log(req.url);
  next();
})

const {
    PORT = 5000
} = process.env;


app.use("/api/auth", auth);
app.use("/api/dashboard", dashboard);
app.use("/api/download", download);


app.listen(PORT, () => {
    console.log("server running on "+PORT);
})

