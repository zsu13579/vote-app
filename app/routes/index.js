'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var SelectHandler = require(process.cwd() + '/app/controllers/selectHandler.server.js');
var https = require('https');

module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);
   var selectHandler = new SelectHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.render('pages/index');
      });
	  
   app.route('/auth/github/callback')
      .get(function (req, res1) {
		 //var dataStr = (new Date()).valueOf();
		 var code = req.query.code;
		 // var state = req.param('state');
		var headers = req.headers;
		var path = "/login/oauth/access_token";
		headers.host = 'github.com';
		headers['User-Agent']='vote-app';

		path += '?client_id=' + '26f36d99ba1bcd3fbcc7';
		path += '&client_secret='+'de201129efddddc3827c0d5483b85641f6df87a3';
		path += '&code='+ code;

		var opts = {
			hostname:'github.com',
			port:'443',
			path:path,
			headers:headers,
			method:'POST'
		};
		var req1 = https.request(opts, function(res){
			res.setEncoding('utf8');
			res.on('data', function(data){
				var args = data.split('&');
				var tokenInfo = args[0].split("=");
				var token = tokenInfo[1];
				  var path2="/user?access_token="+token;
				  // res1.send(JSON.stringify(token));
				  var headers={'User-Agent': 'vote-app'};
				  // var url = "https://api.github.com/user?access_token="+token;
				  var req2 = https.request({host:'api.github.com',port:'443',path:path2,method:'GET',headers:headers},function(res2){
				  res2.setEncoding('utf8');
				  res2.on('data',function(data){
					// TODO					
					console.log(data);
				  })
				});
				req2.end(); 
				// TODO when to redirect
				res1.redirect("/newpolls");
				// https.get(url,function(res){
					// // res.setEncoding('utf8');					
					// res.on('data', function(data){
						// console.log(data);
						// res1.render("pages/index");
						
					// });				
				// })
				
			})
			
        });
		req1.end();
    // headers.host = 'api.github.com';
	// headers.Authorization = 'token '+"367519db02107a19bea255b63ae0878ce9705049"
    // var path2= "/user"
        // var req2 = https.request({host:'api.github.com',port:'443',path:path2,headers:headers,method:'GET',},function(res2){
          // res2.setEncoding('utf8');
          // res2.on('data',function(data){
            // // res1.send(JSON.stringify(data));
			// console.log(JSON.stringify(data));
          // })
        // });
        // req2.end(); 
		 
      });	  

   app.route('/newpolls')
      .get(function (req, res) {
         res.render('pages/newpolls');
      });   

   app.route('/vote/:voteName')
      .get(function (req, res) {
		 var voteName=req.params.voteName;  
         var votes = db.collection('votes');
         var selectProjection = { '_id': false };
         votes.find({"voteName":voteName}, selectProjection).toArray(function (err, result){
            if (err) {
                  throw err;
            }
            var options=[];
            result[0].options.forEach(function(value){
                options.push(Object.keys(value));
            });
            
            res.render('pages/vote',{"voteName":voteName,"options":JSON.stringify(options)});    
            });         
      });   

    app.route('/api/votes')
      .get(voteHandler.getVotes)
      .post(voteHandler.addVote);

    app.route('/api/selectvotes/:voteName')
           .get(selectHandler.getSelectChoices)
	
	app.route('/api/selectvotes/')
           .post(selectHandler.addVote);

    app.route('/api/deletevotes/')
           .post(selectHandler.deleteVote);	
		   
};
