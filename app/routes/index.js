'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var SelectHandler = require(process.cwd() + '/app/controllers/selectHandler.server.js');

module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);
   var selectHandler = new SelectHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.render('pages/index');
      });

   app.route('/newpolls')
      .get(function (req, res) {
         res.render('pages/newpolls');
      });   

   app.route('/vote/:voteName')
      .get(function (req, res) {
		 var voteName=req.params.voteName;
		 // console.log(voteName)
		 // var selectHandler = new SelectHandler(db);
		 // selectHandler.setvoteName(voteName);
		 //  app.route('/api/selectvotes/')
			//   .get(selectHandler.getSelectChoices)
			//   .post(voteHandler.addVote)
			//   .delete(voteHandler.deleteVote);   
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
      .post(voteHandler.addVote)
      .delete(voteHandler.deleteVote);

   app.route('/api/selectvotes/:voteName')
           .get(selectHandler.getSelectChoices)
           .post(selectHandler.addVote);
           // .delete(selectHandler.deleteVote); 
	
	app.route('/api/selectvotes/')
           .post(selectHandler.addVote);
           // .delete(selectHandler.deleteVote);  	
};
