var mysql=require('mysql');
var express = require('express');
var session= require('express-session');
var bodyParser= require('body-parser');
const { response } = require('express');
var FileStore=require('session-file-store')(session);

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'qwerty'
});

var app= express();
app.use(express.static('public'));
app.use(session({
    secret:'secret',
    resave:false,//It basically means that for every request to the server, it reset the session cookie. Even if the request was from the same user or browser and the session was never modified during the request.
    saveUninitialized:false,//the session cookie will not be set on the browser unless the session is modified. 
    store:new FileStore({path:'./session-data'})
}));

app.use(bodyParser.urlencoded({extended:true}));

app.use(function(req,res,next){
    console.log(req.method + " " + req.url);
    next();
;
})

app.get("/",function(res,res){
    res.send("Login Here " + "<a href='./login.html'>Login</a>");
})

app.post('/validate', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM customer WHERE cus_name= ? AND cus_psw = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!' + "<br><a href='./login.html'>Login</a>");
               
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!' + "<br><a href='./login.html'>Login</a>");
		response.end();
	}
});

app.get("/home",function(req,res){
    if(req.session.loggedin){
        res.send("welcome " +req.session.username + "<br>"+ 
        req.session.id + " <br><a href='./logout'>Logout</a>");
    }
    else{
        res.redirect('/login.html');
    }
});

app.get("/logout",function(req,res){
    if(req.session.loggedin)
    {
        req.session.destroy(function(err){
            if(err) return next(err);
            else{
                res.clearCookie("connect.sid");
                res.redirect('/login.html');
            }
        });
    }
    else
    {
        res.redirect('/login.html')
    }
});

app.listen(3333);
