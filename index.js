const express=require('express');
const mongoose=require('mongoose');
const connectDB = require('./database/database');
const cors=require('cors');
const cloudinary=require("cloudinary");
const multipart =require("connect-multiparty");
//dotenv config
require("dotenv").config();
const app=express();
//db connection
connectDB();
//express json
app.use(express.json());
app.use(multipart())
//cors config
const corsOptions={
    origin:true,
    credentials:true,
    optionSuccessStatus:200
};
cloudinary.config({
    cloud_name: "dd45lhgf2",
    api_key: "928168682554382",
    api_secret: "Jae2C-nKZK3WzcBk1d66R72tb3U"
  });
  
app.use(cors(corsOptions));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
//create a route (Route of API)
//request and response
app.get('/',(reg,res)=> {
    res.send('Welcome to API'); 
})
//route
app.use('/api/user/',require('./controllers/usercontroller'));
//middleware for product controller 
app.use('/api/product',require('./controllers/productcontroller'));
//middleware for order Controller
app.use('/api/orders',require('./controllers/orderController'));
//listen to the server
app.listen(process.env.PORT, ()=> {
    console.log (`Server is running on port ${process.env.PORT}`);
});
   
     