'use strict';

var express = require('express');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');

mongo.connect('mongodb://lvzq:123456@ds137110.mlab.com:37110/lvlab', function (err, db) {

   if (err) {
      throw new Error('Database failed to connect!');
   } else {
      console.log('Successfully connected to MongoDB on port 27017.');
   }
   
   // views is directory for all template files
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');

   app.use('/public', express.static(process.cwd() + '/public'));
   app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(session({ 
    secret: 'secret',
    cookie:{ 
        maxAge: 1000*60*30
    }
   }));

   app.use(function(req,res,next){ 
    res.locals.user = req.session.user;   // 从session 获取 user对象
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if(err){ 
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
    }
    next();  //中间件传递
   });

   routes(app, db);

   app.listen(3000, function () {
      console.log('Node.js listening on port 3000...');
   });

});
