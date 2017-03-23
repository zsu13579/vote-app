'use strict';

var VoteHandler = require(process.cwd() + '/app/controllers/voteHandler.server.js');

module.exports = function (app, db) {
   var voteHandler = new VoteHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

   app.route('/vote')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/vote.html');
      });   

   app.route('/api/votes')
      .get(voteHandler.getVotes)
      .post(voteHandler.addVote)
      .delete(voteHandler.deleteVote);

   app.route('/api/selectvotes')
      .get(voteHandler.getVotes)
      .post(voteHandler.addVote)
      .delete(voteHandler.deleteVote);   
};
