'use strict';

var express = require('express');
var mongo = require('mongodb');
var routes = require('./app/routes/index.js');

var app = express();



mongo.connect('mongodb://localhost:27017/voteapp', function (err, db) {

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
   // app.use('/views', express.static(process.cwd() + '/views'));
   // app.engine('ejs', require('ejs').renderFile);


   routes(app, db);

   app.listen(3000, function () {
      console.log('Node.js listening on port 3000...');
   });

});
