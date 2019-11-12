var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/SEAUG2019",{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err) throw err;
    console.log("Database connected");
});

var contributionSchema = new mongoose.Schema({
    contributionid:{
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
    heading:{
        type:String,required:true
    },
    description:{
        type:String
    },
    source:{
        type:String,required:true
    },
    userid:{
        type:String,required:true
    }
});

var contribution = mongoose.model("contribution",contributionSchema);
module.exports = contribution;