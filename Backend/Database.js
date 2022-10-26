const mongoose=require('mongoose');

exports.connectMongoose=()=>{
    mongoose
        .connect("mongodb://localhost:27017/Assignment2")
        .then((e)=>console.log(`Database connected at ${e.connection.host}`))
        .catch((e)=>console.log(e));
};

const userschema= new mongoose.Schema({

    
    email:{
        type:String,
        required: true,
        unique:true,
    },
    name:{
        type:String,
    },
    phone_no: String,
    no_of_rooms: String,
    check_in_date: String,
    check_out_date: String,
    

});

exports.User=mongoose.model("formdata",userschema);