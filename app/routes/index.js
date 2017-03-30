'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var SelectHandler = require(process.cwd() + '/app/controllers/selectHandler.server.js');
var https = require('https');

module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);
   var selectHandler = new SelectHandler(db);

   app.route('/')
      .get(function (req, res) {
         if(!req.session.user){
            res.render('pages/index',{user:req.session.user})
         }else{
         res.render('pages/home');}
      });

   app.route('/home')
      .get(function (req, res) {
         if(!req.session.user){
            res.render('pages/index',{user:req.session.user})
         }else{
         res.render('pages/home');}
      });

    app.route('/logout')
      .get(function (req, res) {
         req.session.user=null;            
         res.redirect('/');
      });  

	  
   app.route('/auth/github/callback')
      .get(function (req, res1) {
		 //var dataStr = (new Date()).valueOf();
		 var code = req.query.code;
		 // var state = req.param('state');
		var headers = req.headers;
    var users=db.collection('users');
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
        
        var path2= "/user?access_token="+token;
        var req2 = https.request({host:'api.github.com',port:'443',path:path2,headers:{'User-Agent':'vote-app'},method:'GET',},function(res2){
          res2.setEncoding('utf8');
          var json='';
          res2.on('data',function(data){
            json+=data;          
          })

          res2.on('end',function(){
            console.log(json)
            json=JSON.parse(json)
            var id=json.id;
            var user=json.login;
            users.find({'id':id}).toArray(function(err,result){
              if (err) {
                throw err;
                } ;
                
              if(result.length==0){
                console.log(result)
                users.insert({id:id,user:user},{save:true},function(err,result){
                  if (err) {
                  throw err;
                  } ;
                  console.log(result)
                })
              }
              req.session.user=user;
              res1.render('pages/home',{user:user})
            })
            
          })

        });
        req2.end(); 
        
			})
			
        });
		    req1.end();
    
		 
      });	  

   app.route('/newpolls')
      .get(function (req, res) {
         res.render('pages/newpolls');
      }); 

   app.route('/mypolls')
      .get(function (req, res) {
         res.render('pages/mypolls');
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

    app.route('/api/myvotes')
      .get(voteHandler.getMyVotes)

    app.route('/api/selectvotes/:voteName')
           .get(selectHandler.getSelectChoices)
	
	app.route('/api/selectvotes/')
           .post(selectHandler.addVote);

    app.route('/api/deletevotes/')
           .post(selectHandler.deleteVote);	
		   
};
