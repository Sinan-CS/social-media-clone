const express = require('express')  
const mongoose= require('mongoose')
const cors = require("cors")
const {readdirSync} = require("fs")
const dotenv =require("dotenv");
dotenv.config();

const app = express(); 
app.use(express.json())
 app.use(cors()); 


 //routes
readdirSync("./routes").map((r)=>app.use("/",require('./routes/' +r)));

//database
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser : true
})
.then(()=>console.log('database connected successfully'))
.catch((err)=>console.log('error connected to mongo db ',err))




const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`server is  runnnig on port ${PORT}..`)
}); 
     