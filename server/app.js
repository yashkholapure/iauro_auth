const express=require("express");
const dotenv=require("dotenv");
const app=express();
const cookieParser=require('cookie-parser')
app.use(cookieParser())





app.use(express.json());
require("./db/connection")
//we link our router files
app.use(require('./router/auth'));

dotenv.config({path:'./config.env'});
const PORT=process.env.PORT || 5000;

const Employee=require("./models/schema");

app.get('/', (req,res)=>{
    res.send("hello auth");
    })


app.listen(PORT,()=>{
    console.log(`connection set up at: ${PORT}`)
})