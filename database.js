var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/SEAUG2019",{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err) throw err;
    console.log("Database connected");
});
var UserSchema=new mongoose.Schema({
    name:{
        type:String,required:true
    },
    email:{
       type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    progress:{
        type:[],default:[0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
});
var User=mongoose.model("User",UserSchema);
module.exports = User;