'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');
var SelectHandler = require(process.cwd() + '/app/controllers/selectHandler.server.js');

module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.render('pages/index');
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
            res.render('pages/vote',{"voteName":voteName,"results":JSON.stringify(result)});    
            });         
      });   

   app.route('/api/votes')
      .get(voteHandler.getVotes)
      .post(voteHandler.addVote)
      .delete(voteHandler.deleteVote);

  
};
