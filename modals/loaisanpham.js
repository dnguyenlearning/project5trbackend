const mongoose=require('mongoose');
const timestamps =require('mongoose-timestamp');

const LoaisanphamSchema=mongoose.Schema({
    loaisanpham:{
        type:String,
        required:true
    },
    nguoitao:{
        type:String,
        required:true
    },
    icon:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    }
})


LoaisanphamSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
const Loaisanpham= mongoose.model('loaisanphams', LoaisanphamSchema);

module.exports=Loaisanpham;