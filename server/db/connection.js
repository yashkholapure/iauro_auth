const mongoose=require("mongoose");
mongoose.set('strictQuery',true);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/iauro-auth",{useNewUrlParser: true , useUnifiedTopology: true})
.then(()=>
    console.log("connection succes")
).catch((e)=>{
    //console.log(e);
    console.log("no connection")
})