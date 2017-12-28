const mongoose=require('mongoose');
const timestamps =require('mongoose-timestamp');

const UserSchema=mongoose.Schema({
    ten:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    idDangnhap:{
        type:String,
        required:true
    },
    phuongphap:{
        type:String,
        required:true
    },
    chucvu:{
        type:String,
        default:'member'
    },
})


UserSchema.plugin(timestamps,{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
const User= mongoose.model('Users', UserSchema);

module.exports=User;