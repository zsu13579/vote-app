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
		 console.log(voteName)
		 var selectHandler = new SelectHandler(db,voteName);
		 selectHandler.voteName=voteName;
		  app.route('/api/selectvotes/')
			  .get(selectHandler.getSelectChoices)
			  .post(voteHandler.addVote)
			  .delete(voteHandler.deleteVote);   
         res.render('pages/vote',{"voteName":voteName});
      });   

   app.route('/api/votes')
      .get(voteHandler.getVotes)
      .post(voteHandler.addVote)
      .delete(voteHandler.deleteVote);

  
};
