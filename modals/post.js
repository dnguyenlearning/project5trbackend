const mongoose=require('mongoose');
const timestamps =require('mongoose-timestamp');

const PostSchema=mongoose.Schema({
    ten:{
        type:String,
    },
    nguoidang:{
        type:String,
    },
    ngayhethan:{
        type:Date,
    },
    gia:{
        type:Number,
    },
    sdt:{
        type:String,
    },
    donvi:{
        type:String,
    },
    xuatxu:{
        type:String,
    },
    loaisanpham:{
        type:String,
    },
    mota:{
        type:String,
    },
    hinhanh:{
        type:Array,
        required:true
    },
    chapnhan:{
        type:Boolean,
        default:false
    }
})


PostSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
const Post= mongoose.model('Post', PostSchema);

module.exports=Post;