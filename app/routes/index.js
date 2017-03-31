'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var SelectHandler = require(process.cwd() + '/app/controllers/selectHandler.server.js');


module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);
   var selectHandler = new SelectHandler(db);

   app.route('/')
      .get(function (req, res) {
         if(!req.session.user){
            res.render('pages/index')
         }else{
         res.render('pages/home',{user:req.session.user});}
      });

   app.route('/home')
      .get(function (req, res) {
         if(!req.session.user){
            res.render('pages/index')
         }else{
         res.render('pages/home',{user:req.session.user});}
      });

    app.route('/logout')
      .get(function (req, res) {
         req.session.user=null;            
         res.redirect('/');
      });  
	  
   app.route('/auth/github/callback')
      .get(
	  voteHandler.loginThroughGithub);	  

   app.route('/newpolls')
      .get(function (req, res) {
		 if(!req.session.user){
            res.render('pages/index')
         }else{
         res.render('pages/newpolls',{user:req.session.user});} 
      }); 

   app.route('/mypolls')
      .get(function (req, res) {
		 if(!req.session.user){
            res.render('pages/index')
         }else{
         res.render('pages/mypolls',{user:req.session.user});}          
      });        

   app.route('/vote')
      .get(function (req, res) {
		 var voteName=req.query.voteName;  
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
