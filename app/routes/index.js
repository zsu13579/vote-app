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
			res1.send(token)		
			})
			
        });
		req1.end()
		 
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
