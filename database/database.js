const mongoose=require('mongoose');
const connectDB=()=>{
//mongoose connection

mongoose.connect(process.env.DB_URL).then(() =>{
    console.log("DB connected"+process.env.DB_URL);
});
};
module.exports=connectDB;