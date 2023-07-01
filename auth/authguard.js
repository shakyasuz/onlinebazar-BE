const jwt=require('jsonwebtoken');
const authguard=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    //if header is not present in request
    if(!authHeader){
        return res.status(401).json({error:"Authorization header not found"});
    }
    //Bearer
    const token=authHeader.split(" ")[1];
    //if token is not present
    if(!token){
        return res.status(401).json({error:"No header token found!"});
    }
    //if token present verify it 
    try{
       const decodedUser=jwt.verify(token,process.env.JWT_SECRET);
       req.user=decodedUser;
       next();

    }catch(error){
        console.log(error);
        res.json({error:"Invalid token!"});
    }
};
module.exports=authguard;