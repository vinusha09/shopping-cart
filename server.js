require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressjwt = require('express-jwt');
var config = require('config.json');


//Using ejs for views 
app.set('view engine','ejs');
app.set('views',__dirname+'/views');



//using body-parser middleware for getting values from form in json format.
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//using middleware for maintaining session
app.use(session({secret : config.secret,resave : false,saveUninitialized : true}));	

app.use( express.static( "public" ) );

//using jsonwebtoken(JWT) authentication to secure api for serving data
app.use('/api',expressjwt({secret : config.secret}).unless({path : ['/api/users/authenticate','/api/users/register','/api/products/allProducts',/^\/api\/products\/productName\/.*/]}));

//routes
app.use('/app',require('./controller/appController'));
app.use('/login',require('./controller/loginController'));
app.use('/register',require('./controller/registerController'));
app.use('/logout',require('./controller/logoutController'));
app.use('/api/users/',require('./controller/usersController'));
app.use('/api/products/',require('./controller/api/productsController'));

app.get('/',function(req,res){
	return res.redirect('/app');
});

var server = app.listen(3000,function(){
	console.log('Server is running on address http://'+server.address().address+'on port '+server.address().port);
});
