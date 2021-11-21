const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require("./routes/auth");
const userRoot = require('./routes/users');
const movieRoot = require('./routes/movies')
const ListRoot = require('./routes/lists')
dotenv.config();


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }).then(()=>console.log('DB conection successful'))
    .catch((err)=> console.log(err));

app.use(express.json());
app.use(cors())

app.use("/api/auth", authRoute);
app.use("/api/users", userRoot);
app.use("/api/movies", movieRoot);
app.use("/api/lists", ListRoot);
app.listen(8800, ()=> {
    console.log("Backend server in running!")
})