'use strict';

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
      votes.findAndModify({}, { '_id': 1 }, { $inc: { 'voteName': 1 }}, function (err, result) {
         if (err) {
            throw err;
         }

         res.send(result);
      });
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
