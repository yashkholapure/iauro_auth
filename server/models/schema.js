const mongoose=require("mongoose");

const jwt = require("jsonwebtoken")
const express = require("express")
//const cookieParser=require('cookie-parser')
 const server=express()
 //server.use(cookieParser())

const userSchema=new mongoose.Schema({

         name:
             {
                type:String,
                required: true
        
         },
         email:
             {
                type:String,
                required:true
        
         }, 
        
         password:
             {
                type:String,
                required:true
         
         }, 
         confirm_password:
             {
                type:String,
                required:true
        
         },
         
         tokens:[
             {
                 token:{
                    type:String,
                    required:true
                 }
             }
         ]
}

)


//generating token

userSchema.methods.generateAuthToken=async function(){
    try{
let tokengenerated=jwt.sign({_id:this._id},process.env.SECRET_KEY)   //token generated
this.tokens=this.tokens.concat({token: tokengenerated})              //storing the token
await this.save()
return tokengenerated;
    }catch(e){
        console.log(e)
    }
}

// userSchema.methods.addMessage= async function(name,message){
//     try{
//           this.messages=this.messages.concat({name,message})
//           await this.save()
//           return this.messages  
//     }catch(e){
//         console.log(e)
//     }
// }

const User= new mongoose.model("Iauro_user",userSchema)

module.exports=User;