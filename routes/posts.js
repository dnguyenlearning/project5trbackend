const route=require('express').Router();
const jwt=require('jsonwebtoken');
const config=require('../config/config');
const multer = require("multer");
const Post=require('../modals/post');
const path=require('path');
const fs=require('fs');
route.post('/upload')

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads/');
    },
    filename:(req,file,cb)=>{
        file.originalname=file.originalname.replace(' ','_');
        cb(null,file.fieldname+'-'+file.originalname.split('.')[0]+Date.now()+path.extname(file.originalname));
    }
})


//init upload
const upload=multer({
    storage:storage
}).array('uploads[]',12);



route.get('/tatca/:chapnhan',(req,res)=>{
    let chapnhan=req.params.chapnhan;
    Post.find({chapnhan:chapnhan},(err, posts)=>{
        if(err) res.json({success:false,msg:err})
        res.json({success:true, posts:posts});
    }).sort({_id:-1})
})

// 
route.post('/post/upload',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        upload(req,res,function(err){
            if(err){
                 res.json({success:false,msg:err});
                 return;
            }
            let newLinkArray=[];
            for(let i=0;i<req.files.length;i++){
                newLinkArray.push('http://localhost:3000/uploads/'+req.files[i].filename);
            }
            let newPost=new Post({
                hinhanh:newLinkArray
            })
            newPost.save((err,post)=>{
                if(err) return res.json({success:false, msg:err});
                res.json({success:true, postId:post._id});
            })
           
        });
    });
    
});





route.get('/loaisanpham/:loaisanphamId',(req,res)=>{
    let loaisanphamId=(req.params.loaisanphamId);
    Post.find({loaisanpham:loaisanphamId},(err, posts)=>{
        if(err) res.json({success:false,msg:err})
        res.json({success:true, products:posts});
    }).sort({_id:-1})
})

//
route.put('/post/update/:postId',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        let ngayhethan=new Date();
        ngayhethan.setDate(ngayhethan.getDate()+ Number(req.body.ngayhethan));
        Post.findOneAndUpdate({_id:req.params.postId},{$set:{
            ten:req.body.ten,
            nguoidang:req.body.nguoidang,
            ngayhethan: ngayhethan,
            gia:req.body.gia,
            sdt:req.body.sdt,
            donvi:req.body.donvi,
            xuatxu:req.body.xuatxu,
            loaisanpham:req.body.loaisanpham,
            mota:req.body.mota,
            sdt:req.body.sdt
        }},(err, updatedPost)=>{
            if(err) return res.json({success:false,msg:err});
            res.json({success:true, msg:'updated Post!', newPost: updatedPost})
        });
    });
})


route.get('/post/:postId',(req,res)=>{
    let postId=(req.params.postId);
    Post.findOne({_id:postId},(err, post)=>{
        if(err) res.json({success:false,msg:err})
        res.json({success:true, post:post});
    })
})


route.put('/post/:postId',verifyUser,(req,res,next)=>{
    let postId=req.params.postId;

    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        if(user.chucvu=='admin'){
            Post.findOneAndUpdate({_id:req.params.postId},{$set:{
                chapnhan:true
            }},(err, updatedPost)=>{
                if(err) return res.json({success:false,msg:err});
                res.json({success:true, msg:'updated Post!', Postupdated: updatedPost})
            });
        }else{
            res.json({success:false,msg:'Unauthorized!'})
        }
    });
})

route.delete('/post/:postId',verifyUser,(req,res,next)=>{
    let postId=req.params.postId;
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        if(user.chucvu=='admin'){
            Post.findOneAndRemove({_id:req.params.postId},(err,post)=>{
                if(err) return res.json({success:false, msg:err}) 

                for(let i=0;i<post.hinhanh.length;i++){
                    let filename=post.hinhanh[i].replace('http://localhost:3000/uploads/',"");
                    fs.unlink('./src/uploads/'+filename, (err)=>{
                        if(err) throw err;
                    })
                }
                res.json({success:true, msg:'delete successfully!'});
            })
        }else{
            res.json({success:false,msg:'Unauthorized!'})
        }
    });
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