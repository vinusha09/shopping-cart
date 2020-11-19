# Mean-Stack-Shopping-Cart
MEAN stack shoppingcart with user role's and permission using JWT tokens.From this MEAN app , you can learn how to authenticate your API's with JSON web token, maintaining user role's and permission at url level to secure API's from unauthorized access as well as how to show/hide different views for different user roles.So lets start with MEAN stack shoppingcart app setup.

As this application is only for learning purpose so it is developed for developer's only to understand concept and make use of it, if they found it usefull in any terms.

To see this application in action you need to follow below steps :

1) Download node and mongodb setup, after that install on your local machine.

2) Run mongod.exe from CMD or from mongodb installation path(C:/Program Files) to start database.

3) After installation process, goto shoppingcart folder from CMD. 

4) In CMD, type 'npm install' to install all node modules.

5) If everything goes fine, type 'node server.js' in CMD to run server. If it start properly then it will give you message 'Server is running on address http://127.0.0.1 on port 3000'.

6) GOTO Browser and type '127.0.0.1:3000' or 'localhost:3000'. Congratulations your app is in working conditions and you can proceed further to learn from it, to play with it, to find faluts or anything you want.

To understand this MEAN stack application and get full use of it please read below.

Mainly there are three roles in this MEAN app which are :

1) Admin role - Admin role can do everything in this application.He can see user details, able to update user details and delete them. Admin role can also see all product details and can update them and delete them.  

To make admin role in this application. Goto register link placed at Top-Right corner and give fill all details with username - 'admin'. To make a user admin its username must be 'admin' (lowercase) and no other user can have same username in this application.

For ease we make username - 'admin' and password - 'admin'.


2) Product Handler role - ProductHandler role can do all product related stuff as name indicating that.He can see product details , update them , delete them and create new products.


To make 'productHandler' role in this application. Goto Register link placed at Top-Right corner and give fill all details with username - 'productHandler'. To make a user 'Product Handler'  its username must be 'productHandler' (lowercase) and no other user can have same username in this application.

For ease we make username - 'productHandler' and password - 'productHandler'.

3) User Role - User role can only update its details and see product details and add them to cart.

Username for role user can be anything other than 'admin' or 'productHandler'.


After understanding all role's mechanism, now lets understand how all things are working and can provide you secure access.

Registration Process :

When a new user register in the application, we first check if the username taken by him/her is unique in database and after that we make his/her password in hash form for security purpose.At last if username is not 'admin' or 'productHandler' we assign 'role' = 'user' for that particular user.

1) For eliminating password field from user details we user lodash.omit() function.

2) For hashing user password we use Bcyrpt.hashSync() function.

    var user = lodash.omit(userParam,'password');

		user.hash  = bcrypt.hashSync(userParam.password,10);

		if(user.username === 'admin'){
			user.role = 'admin';
		}
		else if(user.username === 'productHandler'){
			user.role = 'productHandler';
		}
		else{
			user.role = 'user';
		}

Login Process : 

In login part, We simply compare user password with its hashed value save in the database at the time of creation of that particular user.After that we assign user a token(JSON web token) for further authentication to access all API's in MEAN stack app.

1) For comparing user passsword and hashed value we use Bcyrpt.compareSync() function.

2) For JSON Web Token, we use jwt.sign() function.

						if(user && bcrypt.compareSync(password,user.hash)){
							defer.resolve(jwt.sign({sub : user._id},config.secret));
						}
            
After successful authentication, At client's header part we set this 'jsonwebtoken' for further API's authorization.  
            
 For restricting all API's we use 'express-jwt' module of node js which check whether coming request from client side have 'jsonwebtoken' in its header part or not.
 
 
 app.use('/api',expressjwt({secret : config.secret}).unless({path : ['/api/users/authenticate','/api/users/register','/api/products/allProducts',/^\/api\/products\/productName\/.*/]}));
 
 In above code, we are restricting our all API's and leaving those which are available for everyone in unless part.
 
 Now for role based authorization for particular API's, we made simple middleware named 'requiredRole' which can accept three parameters for tree roles and if a certain API is not for particular role then we can pass its argument value to 'null'.
 
 
 	function requiredRole(arg1,arg2,arg3){
		return function(req,res,next){
		
		var role = null;
		
		if(req.session.token){
			
			request.get({
				url : 'http://localhost:3000/app/role'
			},function(err,response,body){
				if(err){
					res.status(404).send(err);
				}
				else{
					role = body;
					var flag = false;
					if(arg1 !== 'null' && role === 'admin'){
						flag =true;
						next();
					}
					if(arg2 !== 'null' && role === 'productHandler'){
						flag = true;
						next();
					}
					if(arg3 !== 'null' && role === 'user'){
						flag = true;
						next();
					}
					if(!flag){
						console.log("Not Authorized");
						res.sendStatus(401);
					}
				
				}
			});
			
				
			
		}
		}
	
		}


	router.delete('/:_id',requiredRole("admin","null","null"),_delete);
	router.put('/:_id',requiredRole("admin","null","user"),update);
	router.post('/register',register);
	router.post('/authenticate',authenticate);
	router.get('/current',current);
	router.get('/allUsers',requiredRole("admin","null","null"),getAllUsers);
	router.get('/:_id',requiredRole("admin","null","user"),getById);


We can make this middleware more efficient, but for understanding and learning purpose we make this as simple as we can.


At Angular level(GUI part) we make directive named 'permission' which accepts user roles.In this directive, we can pass those roles to whom we want to show that view instead of others.

For more understanding, I will keep updating this area.

 
