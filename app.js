var express = require('express');
var parser = require('body-parser');
var path = require('path');
var expressValidator= require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

/*var logger = function(req,res,next){
	console.log('logging');
	next();
};
app.use(logger);
*/
// View Engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Body Parser Middleware 
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));

// Set static path
app.use(express.static(path.join(__dirname,'public'))); 
//Global vars
app.use(function(req,res,next){
	res.locals.errors =null;
	next();
});
//Express Validator Middleware
 app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var user =[
	{
		fname:'Sergio',
		lname: 'Ramos',
		id: 151241,

	},
	{
		fname:'Mario',
		lname: 'Manzukich',
		id: 151221,

	},
	{
		fname:'Sergio',
		lname: 'Roberto',
		id: 151222,

	},
	]

app.get('/',function(req,res){
	db.users.find(function (err, docs) {
    res.render('index',{
		title:'Client Details',
		users : docs
	});// docs is an array of all the documents in mycollection 
})

	
});

app.post('/users/add', function( req,res){


	req.checkBody('fname','First name is Required and it should be all alphabets').notEmpty();
	req.checkBody('lname','Last name is Required and it should be all alphabets').notEmpty();
	req.checkBody('id','Id is Required and it needs to be a number').notEmpty();
	

	var errors = req.validationErrors();
	if(errors)
			{  
				db.users.find(function (err, docs) {
		        res.render('index',{
					title:'Client Details',
					users : docs,
					errors : errors
				});
		    })
			}

	else
	{

		var newUser =
		{
			fname : req.body.fname,
			lname : req.body.lname,
			id : req.body.id
		}
		db.users.insert(newUser,function(err,result){
			if(err)
			{
				console.log(err);
			}
			
			
				res.redirect('/');
			
		})
	}
	
});

app.delete('/users/delete/:id',function(req,res){
	db.users.remove({_id: ObjectId(req.params.id)},function(err,results){

		if(err){
			console.log(err);
		}
		res.redirect('/');

	})
});

app.listen(3000, function(){
	console.log('server started on port 3000');
})