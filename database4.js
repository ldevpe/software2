var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/SEAUG2019",{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err) throw err;
    console.log("Database connected");
});

var replySchema = new mongoose.Schema({
    textid:{
        type:Number,required:true
    },
    questionid:{
        type:Number,required:true
    },
    postedtime:{
        type:Date,default:Date.now()
    },
    upvotes:{
        type:Number,default:0
    },
    downvotes:{
        type:Number,default:0
    },
    source:{
        type:String,required:true
    },
    username:{
        type:String,required:true
    }
});

var reply = mongoose.model("reply",replySchema);
module.exports = reply;