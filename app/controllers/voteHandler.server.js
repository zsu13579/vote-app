'use strict';
var https = require('https');

function VoteHandler (db) {
   var votes = db.collection('votes');

   this.getVotes = function (req, res) {

      var voteProjection = { '_id': false };
      // var tmp1={voteName:"test2"};
      // votes.insert(tmp1,{save:true},function(err,result){
         // console.log(result)
      // })  
      // votes.find({}, voteProjection, function (err, result) {
      //    if (err) {
      //       throw err;
      //    }
      //    res.json(result.toString()); 
      //    console.log(result)      
      // });

      votes.find({}, voteProjection).toArray(function (err, result){
         if (err) {
            throw err;
         }		 
         res.send(JSON.stringify(result));     
      });
   };

   this.getMyVotes = function (req, res) {

      var voteProjection = { '_id': false };
      var user=req.session.user;
      votes.find({user:user}, voteProjection).toArray(function (err, result){
         if (err) {
            throw err;
         }      
         res.send(JSON.stringify(result));     
      });
   };
   
   this.loginThroughGithub = function(req, res1) {
		
		 //var dataStr = (new Date()).valueOf();
		 var code = req.query.code;
		 // var state = req.param('state');
		var headers = req.headers;
    var users=db.collection('users');
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
	 
   };
   
   // this.getSelectChoices = function (req, res) {

      // var selectProjection = { '_id': false };
	  // var voteName=req.params.voteName;
      // votes.find({"voteName":voteName}, selectProjection).toArray(function (err, result){
         // if (err) {
            // throw err;
         // }
         // res.send(JSON.stringify(result));     
      // });
   // };

   this.addVote = function (req, res) {

      var user=req.session.user;
      var options=[];
      var title=req.body.title;
      req.body.options.split("\r\n").forEach(function(value){
         var t={};
         t[value]=0;
         options.push(t);
      })

      var newvote={user:user,voteName:title,options:options};
      votes.insert(newvote,{save:true},function(err,result){
         res.redirect("/home")
      })  

      // votes.findAndModify({}, { '_id': 1 }, { $inc: { 'voteName': 1 }}, function (err, result) {
      //    if (err) {
      //       throw err;
      //    }

      //    res.send(result);
      // });
   };

   this.deleteVote = function (req, res) {
      votes.update({}, { 'clicks': 0 }, function (err, result) {
         if (err) {
            throw err;
         }
         res.send(result);
      });
   };
}

module.exports = VoteHandler;
