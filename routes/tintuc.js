const route=require('express').Router();
const jwt=require('jsonwebtoken');
const config=require('../config/config');

const Tintuc=require('../modals/tintuc');




route.post('/create', verifyUser, (req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        if(user.chucvu=='admin'){
           let newTintuc=new Tintuc({
               title:req.body.title,
               nguoitao:user.id,
               body:req.body.body
           })
           newTintuc.save((err,newTintuc)=>{
            if(err) return res.json({success:false, msg:err});
            return res.json({success:true, newTintuc})
           })
        }else{
            res.json({success:false,msg:'Unauthorized!'})
        }
    });
})

route.get('/tatca', (req,res,next)=>{
    Tintuc.find({},(err, tintucs)=>{
        if(err) return res.json({success:false, msg:err});
        return res.json({success:true, tintucs})
    }).sort({_id:-1}).limit(5);
})

route.get('/:tintucId',(req,res,next)=>{
    let id=req.params.tintucId;
    if(!id) return res.json({success:false, msg:'something wrong'});
    Tintuc.findOne({_id:id},(err,tintuc)=>{
        if(err) return res.json({success:false, msg:err});
        return res.json({success:true, tintuc});
    })
})

route.delete('/:tintucId',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        if(user.chucvu=='admin'){
            let id=req.params.tintucId;
            if(!id) return res.json({success:false, msg:'something wrong'});
            Tintuc.remove({_id:id},(err)=>{
                if(err) return res.json({success:false, msg:err});
                return res.json({success:true, msg:'xoá thành công'});
            })
            }else{
                res.json({success:false,msg:'Unauthorized!'})
            }
    })
})

route.put('/:tintucId',verifyUser,(req,res,next)=>{
    jwt.verify(req.token,config.secret,(err,user)=>{
        if(err) { return res.json({success:false,msg:'Unauthorized!'})}
        if(user.chucvu=='admin'){
            let id=req.params.tintucId;
            if(!id) return res.json({success:false, msg:'something wrong'});
            Tintuc.findOneAndUpdate({_id:id},{$set:{title:req.body.title,body:req.body.body}},(err)=>{
                if(err) return res.json({success:false, msg:err});
                return res.json({success:true, msg:'update thành công'});
            })
            }else{
                res.json({success:false,msg:'Unauthorized!'})
            }
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