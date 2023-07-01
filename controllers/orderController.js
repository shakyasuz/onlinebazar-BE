const router=require("express").Router();
const Order = require("../Models/orderModel");
const authguard = require("../auth/authguard");
router.post("/create",async(req,res)=>{
    //destructuring
    const{cart, totalAmount, shippingAddress}=req.body;
    //validation
    if(!cart || !totalAmount || !shippingAddress){
        return res.status(400).json({msg:"Please enter all fields"});
        }
        try{
            const order=new Order({
                cart:cart,
                totalAmount:totalAmount,
                shippingAddress:shippingAddress,
                // user:req.user.id
                user:'64683e83fe33b5cf4ae25db2'
            })
            await order.save();
            res.json("Order Created successfully");
        }catch(error){
            console.log(error);
            res.status(500).json({msg:error});
        }
        
      
});
router.get("/get_single",authguard,async(req,res)=>{
    try{
        const orders= await Order.find({user:req.user.id});
        res.json(orders);
    }catch(error){
        console.log(error);
        res.status(500).json({msg:error});
    }
});

router.get("/get_all",authguard,async(req,res)=>{
    try{
        const orders= await Order.find({})
        res.json(orders)
    }catch(error){
        res.json("Order fetch failed")
    }
});
//change order status
router.put("/change_status/:id",async(req,res)=>{
    try{
        //find the order
        const order=await Order.findById(req.params.id);
        order.status=req.body.status;
        await order.save();
        res.json("Order status changed successfully");

    }catch(error){
        console.log(error);
        res.status(500).json({msg:error});

    }
})

module.exports = router;