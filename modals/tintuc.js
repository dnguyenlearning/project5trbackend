const mongoose=require('mongoose');
const timestamps =require('mongoose-timestamp');

const TintucSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    nguoitao:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
})


TintucSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
const Tintuc= mongoose.model('tintucs', TintucSchema);

module.exports=Tintuc;