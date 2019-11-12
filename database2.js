var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/SEAUG2019",{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err) throw err;
    console.log("Database connected");
});

var DiscSchema = new mongoose.Schema({
    textid:{
        type:Number,required:true
    },
    postedtime:{
        type:Date,default:Date.now()
    },
    questionid:{
        type:Number,required:true
    },
    question:{
        type:String,required:true
    },
    username:{
        type:String,required:true
    },
    tags:{
        type:[],required:true
    },
    commentscount:{
        type:Number,default:0
    },
    viewcount:{
        type:Number,default:0
    },
    likes:{
        type:Number,default:0
    }
});

var disc = mongoose.model("disc",DiscSchema);
module.exports = disc;