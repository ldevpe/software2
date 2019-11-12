var express = require("express");
var app = express();
var user = require('./database.js');
var disc = require('./database2');
var contribution = require('./database3.js');
var reply = require('./database4.js');
var bodyParser = require('body-parser');
var session = require("express-session");
var cookieParser = require('cookie-parser');
var fs = require('fs');

app.use(express.static('css'));
app.use(express.static('assets'));
app.use(express.static('img'));
app.use(express.static('js'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({secret:"hello world its a secret",resave: true,saveUninitialized: true}));

app.set("view engine","ejs");

app.get("/login",function(req,res,next){
    res.render("login.ejs",{message:req.query.m});
});

app.post("/login",function(req,res,next){
    user.find({email:req.body.email},function(err,result){
        if(err) throw err;
        if(result.length === 0){
            res.redirect("/login?m=2");
        }
        else if(req.body.password === result[0].password){
            var newuser = {id:result[0]._id};
            req.session.user = newuser;
            result[0].islogin = true;
            result[0].session = Date.now();
            result[0].save(function(err){
                if(err) throw err;
            });
            res.redirect("/");
        }
        else{
            res.redirect("/login?m=1");
        }
    });
});

app.get("/signup",function(req,res,next){
    if(req.session.user){
        res.redirect("/");
    }
    else{
        res.render("signup.ejs",{message:""});
    }
});

app.post("/forgotpassword",function(req,res,next){
    user.find({email:req.body.email},function(err,result){
        if(err) throw err;
        if(result.length === 0){
            res.redirect("/forgotpassword?m=2");
        }
        else{
            var nodemailer = require("nodemailer");
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'kustapuramdileepreddy123@gmail.com',
                    pass: '9748225345'
                }
            });
            var mailOptions = {
                from: 'cs17b034@iittp.ac.in',
                to: req.body.email,
                subject: 'password reset | l`devpe`',
                html: '<!DOCTYPE html><html><head><title>l`devpe`</title></head><body><form action="http://localhost:3000/confirmpassword" method="POST"><div><input name = "email" type="email" placeholder="'+req.body.email+'"value="'+req.body.email+'" readonly /><br /><label for="password">NEW PASSWORD</label><br /><input name="password" type="password" placeholder="password" required = "true"/></div><br /><input type="submit" value="update password" /></form></body>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                  res.render("confirmpassword.ejs");
                }
            });
        }
    });
});

app.post("/confirmpassword",function(req,res,next){
    user.find({email:req.body.email},function(err,result){
        if(err) throw err;
        console.log(result);
        if(result.length !== 0){
            result[0].password = req.body.password;
            result[0].save(function(err){
                if(err) throw err;
                console.log("password succesfully changed");
                var nodemailer = require("nodemailer");
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                      user: 'kustapuramdileepreddy123@gmail.com',
                       pass: '9748225345'
                    }
                });
                var mailOptions = {
                    from: 'cs17b034@iittp.ac.in',
                    to: req.body.email,
                    subject: 'your password is sucessfully changed | l`devpe`',
                    text: 'your new password is updated'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.redirect("/login?m=7");
                    }
                });
            });
        }
    });
});

app.post("/signup",function(req,res,next){
    user.find({email:req.body.email},function(err,result){
        if(err) throw err;
        if(result.length !== 0){
            res.redirect("/login?m=6");
        }
        else{
            var newuser = new user({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });
            newuser.save(function(err){
                if(err) throw err;
                res.redirect("/login?m=5");
            });
        }
    });
});

app.get("/forgotpassword",function(req,res,next){
    if(req.session.user){
        res.redirect("/");
    }
    else
    res.render("forgotpassword.ejs",{message:req.query.m});
});

app.get("*",function(req,res,next){
    if(!req.session.user)
    {
        res.redirect("/login");
    }
    else{
        user.findById(req.session.user.id,function(err,result){
            if(err) throw err;
            if(result.length === 0)
            {
                res.redirect("/login");
            }
            else{
                req.user = result;
                next();
            }
        });
    }
});

app.post("*",function(req,res,next){
    if(!req.session.user)
    {
        res.redirect("/login");
    }
    else{
        user.findById(req.session.user.id,function(err,result){
            if(err) throw err;
            if(result.length === 0)
            {
                res.redirect("/login");
            }
            else{
                req.user = result;
                next();
            }
        });
    }
});

app.get("/logout",function(req,res,next){
    req.session.destroy();
    res.redirect("/login");
});

app.get("/disc/:id",function(req,res,next){
    disc.find({textid:Number(req.params.id)},function(err,result){
        if(err) throw err;
        res.render("disc",{message:result,id:req.params.id});
    });
});

app.get("/disc/:id/q/:questionid",function(req,res,next){
    reply.find({textid:req.params.id,questionid:req.params.questionid},
        function(err,results){
            if(err) throw err;
            res.status(200).json({
                results:results
            });
        });
});

app.post("/disc/:id/q/:questionid",function(req,res,next){
    var newreply = new reply({
        textid:req.params.id,
        questionid:req.params.questionid,
        source : req.body.solution,
        username : req.user.name
    });
    newreply.save(function(err,n){
        if (err) throw err;
        res.status(200).json({
            results:null
        });
    });
});

app.post("/disc/:id/q/:questionid/likes",function(req,res,next){
    disc.find({textid:req.params.id,questionid:req.params.questionid},function(err,results){
        if(err) throw err;
        results[0].likes = results[0].likes+1;
        results[0].save(function(err,n){
            if(err) throw err;
            res.status(200).json({
                likes:n.likes
            });
        }); 
    });
});

app.post("/disc/:id/post",function(req,res,next){
    if(req.params.id > 12)
    {
        res.redirect("/disc/0/");
    }
    else
    disc.find({textid:req.params.id},function(err,result1){
        if(err) throw err;
        var newdisc = new disc({
            textid:req.params.id,
            question:req.body.question,
            username: req.user.name,
            tags:req.body.post,
            questionid:result1.length
        });
        newdisc.save(function(err,n){
            if(err) throw err;
            res.redirect("/disc/"+req.params.id);
        });
    });
});

app.get("/profile",function(req,res,next){
    contribution.find({userid:req.user._id},function(err,results){
        if(err) throw err;
        console.log(results);
        res.render("page9.ejs",{name:req.user.name,email:req.user.email,contributions:results});
    });
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 

app.post("/contribute",function(req,res,next){
    var lin = "/contributions/"+req.user.email+'/'+makeid(15)+'.html';
    var newcontribution = new contribution({
        userid:req.user._id,
        source: lin,
        heading:req.body.heading,
        description:req.body.description
    });
    newcontribution.save(function(err,n){
        if(err) throw err;
        console.log(n);
        fs.writeFile('/views'+lin,req.body.source,
        function(err){
            if(err) throw err;
            console.log("/contribution - saved");
            res.redirect("/profile");
        });
    });
});

app.get("/",function(req,res,next){
    res.render("index.ejs");
});

app.get("/page5",function(req,res,next){
    res.render("page5.ejs");
});

app.get("/page6",function(req,res,next){
    res.render("page6.ejs");
});

app.get("/safety",function(req,res,next){
    res.render("safety.ejs");
});

app.get("/progress",function(req,res,next){
    res.render("progress.ejs",{message:req.user.progress});
});

app.get("/resources",function(req,res,next){
        res.render("resources.ejs");
});

app.get("/daily_practice",function(req,res,next){
    res.render("daily_practice.ejs");
});

app.get("/challenger",function(req,res,next){
    res.render("challenger.ejs");
});

app.get("/explore",function(req,res,next){
    res.render("explore.ejs");
});

app.listen(3000 , function(){
    console.log("server on port 3000 is started!!!! ");
} );
