const route=require('express').Router();
const jwt=require('jsonwebtoken');
const config=require('../config/config');
const multer = require("multer");
const Post=require('../modals/post');
const path=require('path');
const fs=require('fs');
const cloudinary = require('cloudinary');

const storage=multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname.replace('routes','')+ 'src/uploads');
    },
    filename:(req,file,cb)=>{
        file.originalname=file.originalname.replace(' ','_');
        cb(null,file.fieldname+'-'+file.originalname.split('.')[0]+Date.now()+path.extname(file.originalname));
    }
})



cloudinary.config({
    cloud_name: config.cloundinary.cloud_name, 
    api_key: config.cloundinary.api_key, 
    api_secret: config.cloundinary.secret 
})
//init upload dsafas
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
        try{
            
            upload(req,res,function(err){
                if(err) return res.json({success:false,msg:err});
                let fileNames=[];
                let imagesClound=[];
                let publicIdClound=[];
                for(let [index,file] of req.files.entries()){
                    let fileName=file.filename;
                    fileNames.push(fileName);
                    cloudinary.uploader.upload('./src/uploads/'+file.filename,(result,err)=>{
                        if(err) return res.json({success:false,msg:err});
                        publicIdClound.push(result.public_id)
                        imagesClound.push(result.url);
                        
                        if(imagesClound.length==req.files.length){
                            return res.json({success:true,imagesClound:imagesClound,uploadLink:fileNames, publicIdClound:publicIdClound});
                        }
                    })
                }

                
               
            });
        }catch(err){
            throw err;
        }
        
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
route.post('/post/create',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        // let ngayhethan=new Date();
        // ngayhethan.setDate(ngayhethan.getDate()+ Number(req.body.ngayhethan));

        let newPost=new Post({
            ten:req.body.ten,
            nguoidang:req.body.nguoidang,
            filesName:req.body.filesName,
            // ngayhethan: ngayhethan,
            hinhanh:req.body.link,
            publicId:req.body.publicIdClound,
            gia:req.body.gia,
            sdt:req.body.sdt,
            donvi:req.body.donvi,
            xuatxu:req.body.xuatxu,
            loaisanpham:req.body.loaisanpham,
            mota:req.body.mota,
            sdt:req.body.sdt
        })
        newPost.save((err, newPost)=>{
            if(err) return res.json({success:false,msg:err});
            res.json({success:true, msg:'updated Post!', newPost: newPost})
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
 
//test

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
                if(!post)  return res.json({success:false, msg:'Not found'});
                for(let i=0;i<post.filesName.length;i++){
                    let filename=post.filesName[i];
                    let path=__dirname.replace('routes','')+'src/uploads/'+filename;
                    
                    if(fs.existsSync(path)){
                        fs.unlink(path, (err)=>{
                            if(err) throw err;
                        })
                    }
                }

                for(let [index,public_id] of post.publicId.entries()){
                    cloudinary.uploader.destroy(public_id,(err,result)=>{
                        if(err.result!='ok') return res.json({success:false, msg:'Not found'});
                        if(index==post.publicId.length-1){
                            res.json({success:true,msg:'Deleted Post Successfully'});
                        }
                    })

                }
                
            })
        }else{
            res.json({success:false,msg:'Unauthorized!'})
        }
    });
})


// route.post('/delete/post',(req,res)=>{
    
//     cloudinary.uploader.destroy('vvird1xo0lpugie6rf5d',(err,result)=>{
//         console.log(err);
//         console.log(result);
//         res.send('done');
//     })

// })



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