const router = require("express").Router();
const Product = require("../Models/productmodel");
const cloudinary = require("cloudinary");
const authguard = require("../auth/authguard");
const productmodel = require("../Models/productmodel");
const Order = require("../Models/orderModel");
const user = require('../Models/usermodel');
//create a add product route
router.post("/add", authguard, async (req, res) => {
    console.log(req.body)
    //destructuring
    const { Name, Price, Category, Description } = req.body;
    const { image } = req.files;
    //validation
    if (!Name || !Price || !Category || !Description || !image) {
        return res.json({ msg: "Please enter all fields" });
    }
    const uploadedImage = await cloudinary.v2.uploader.upload(
        image.path,
        {
            folder: "onlineshop",
            crop: "scale"
        },
    );


    try {

        //create a new product
        const newProduct = new Product({
            name: Name,
            price: Price,
            description: Description,
            category: Category,
            pimage: uploadedImage.secure_url

        });
        //save the product
        await newProduct.save();
        res.json("Product registered successfully");


    } catch (error) {
        console.log(error)
        res.json("product failed");
    }
});
router.get("/get_products", async (req, res) => {
    try {
        const products = await productmodel.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" });
    }

});
router.get("/get_products/:id", async (req, res) => {
    try {
        const products = await productmodel.findById(req.params.id);
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ msg: "Internal server error" });
    }

});
//delete product
router.delete("/delete_products/:id", authguard, async (req, res) => {
    try {
        console.log(req.params.id)
        const product = await productmodel.findById(req.params.id);
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server errir" });
    }
});
//search products
router.get("/search_product/:name",async(req,res)=>{
    try{
        //regex: to match name field of product
        //option:"i" should be case insensitive
        const products=await productmodel.find({
            name:{
                $regex:req.params.name,
                $options:'i'
            }
        });
        res.status(200).json(products)
    } catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error" })
    }

});
//count products, pending orders, delivered orders, users
router.get("/count",async(req,res)=>{
    try{

        const productCount=await productmodel.countDocuments({});
        const pendingOrders=await Order.countDocuments({status:"Pending"});
        const deliveredOrders=await Order.countDocuments({status:"Delivered"});
        const userCount=await user.countDocuments({});
        res.status(200).json({productCount, pendingOrders,deliveredOrders,userCount})
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal Server Error"})

    }
})

//updating product
router.put("/update_products/:id", async (req, res) => {
    console.log(req.body)
    //destructuring
    const { Name, Price, Category, Description } = req.body;
    const { image } = req.files;
    //validation
    if (!Name || !Price || !Category || !Description || !image) {
        return res.json({ msg: "Please enter all fields" });
    }



    try {

        if (image) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                image.path,
                {
                    folder: "onlineshop",
                    crop: "scale"
                },
            );

            //update product
            const Product = await productmodel.findById(req.params.id);
            Product.name = Name;
            Product.price = Price;
            Product.category = Category;
            Product.description = Description;
            Product.pimage = uploadedImage.secure_url;

            //save the product
            await Product.save();
            //------------------------------------//
            res.json("Product updated successfully");
        } else {
            //update product
            const Product = await productmodel.findById(req.params.id);
            Product.name = Name;
            Product.price = Price;
            Product.category = Category;
            Product.description = Description;

            //save the product
            await Product.save();
            //------------------------------------//
            res.json("Product updated successfully");
        }


    } catch (error) {
        console.log(error)
        res.json("product failed");
    }
});

module.exports = router;