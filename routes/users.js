const route=require('express').Router();
const jwt=require('jsonwebtoken');
const config=require('../config/config');

const User=require('../modals/user');



route.post('/authenticate',(req,res,next)=>{
    if(req.body.id){
        User.findOne({idDangnhap:req.body.id},(err,user)=>{
            if(err) return res.json({success:true, msg:'failed to find data'});
            if(user){
                let currentUser={
                    id:user.id,
                    ten:user.ten,
                    email:user.email,
                    idDangnhap:user.idDangnhap,
                    phuongphap:user.phuongphap,
                    chucvu:user.chucvu
                }
                jwt.sign(currentUser,config.secret,{expiresIn: '1d'},(err,token)=>{
                    return res.json({success:true,token:token, chucvu:user.chucvu,userId:user.id,msg:'currentUser'})
                })
            }else{
                let newUser=new User({
                    ten:req.body.name,
                    email:req.body.email,
                    idDangnhap:req.body.id,
                    phuongphap:req.body.provider
                })

                newUser.save((err,newUser)=>{
                    if(err) return res.json({success:false, msg:err});
                    let createdUser={
                        id:newUser.id,
                        ten:newUser.ten,
                        email:newUser.email,
                        idDangnhap:newUser.idDangnhap,
                        phuongphap:newUser.phuongphap,
                        chucvu:newUser.chucvu
                    }
                    jwt.sign(createdUser,config.secret,{expiresIn: '1d'},(err,token)=>{
                        return res.json({success:true,token:token,chucvu:newUser.chucvu, userId:newUser._id,msg:'newUser'})
                    })
                })
            }
        })
    }
})


route.get('/user/:userId',(req,res)=>{
    let userId=req.params.userId;
    User.findOne({_id:userId},(err,user)=>{
        if(err)return res.json({success:false,msg:err});
        if(!user) return res.json({success:false,msg:'Not Found'});
        res.json({success:true, username: user.ten})
    })
})




module.exports=route;