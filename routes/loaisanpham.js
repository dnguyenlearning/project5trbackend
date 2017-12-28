const route=require('express').Router();
const jwt=require('jsonwebtoken');
const config=require('../config/config');

const Loaisanpham=require('../modals/loaisanpham');



route.post('/create',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        let link=req.body.ten.toLowerCase().split(' ').join('');
        let newLoaisanpham=new Loaisanpham({
            loaisanpham:req.body.ten,
            nguoitao:req.body.userId,
            icon:req.body.icon,
            link:link
        })
        newLoaisanpham.save((err,sanpham)=>{
            if(err) return res.json({success:true, msg:err})
            res.json({success:true, msg:'created Loai San Pham Moi!',loaisanpham:sanpham})
        })
    })
    
})

route.get('/all',(req,res,next)=>{
    Loaisanpham.find({},(err,loaisanphams)=>{
        if(err) return res.json({success:true, msg:err})
        res.json({success:true,loaisanphams:loaisanphams})
    })
})

function verifyUser(req,res,next){
    let bearerHeader=req.headers['authorization'];
    
    if(bearerHeader!=undefined){
        let secret=bearerHeader.split(' ')[0];
        if(secret!='gf_token') return res.json({success:false,msg:'Unauthorized!'})
        let token=bearerHeader.split(' ')[1];
        req.token=token;
        next();
    }else{
        res.json({success:false,msg:'Unauthorized!'})
    }
}



module.exports=route;