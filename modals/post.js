const mongoose=require('mongoose');
const timestamps =require('mongoose-timestamp');

const PostSchema=mongoose.Schema({
    ten:{
        type:String,
        required:true,
    },
    nguoidang:{
        type:String,
        required:true,
    },
    // ngayhethan:{
    //     type:Date,
    // },
    gia:{
        type:Number,
        required:true,
    },
    sdt:{
        type:String,
        required:true,
    },
    donvi:{
        type:String,
        required:true,
    },
    xuatxu:{
        type:String,
        required:true,
    },
    loaisanpham:{
        type:String,
        required:true,
    },
    mota:{
        type:String,
        required:true,
    },
    hinhanh:{
        type:Array,
        required:true
    },
    publicId:{
        type:Array,
        required:true
    },
    filesName:{
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