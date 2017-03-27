'use strict';

function SelectHandler (db) {
   var votes = db.collection('votes');
   
    this.getSelectChoices = function (req, res) {

     var selectProjection = { '_id': false };
	  var voteName=req.params.voteName;
     votes.find({"voteName":voteName}, selectProjection).toArray(function (err, result){
      if (err) {
            throw err;
         }
      // console.log(result);
      res.send(JSON.stringify(result));     
      // res.send(JSON.stringify([{"result":1}]))
      });
   
   };

   this.addVote = function (req, res) {
	  var user="jacklv";
      var options=[];
      var title=req.body.title;
      var selectoption=req.body.selectoption;
	  // console.log(title+","+selectoption)
      var newvote={user:user,voteName:title,options:options};
      // votes.insert(newvote,{save:true},function(err,result){
         // res.render("pages/index")
      // })  
 
      // votes.findAndModify({"user":user,"voteName":voteName}, { '_id': 1 }, { $inc: { 'voteName': 1 }}, function (err, result) {
         // if (err) {
            // throw err;
         // }		 
         // res.send(result);
      // });
	   res.end()
   };

   // this.deleteVote = function (req, res) {
      // votes.update({}, { 'clicks': 0 }, function (err, result) {
         // if (err) {
            // throw err;
         // }
         // res.send(result);
      // });
   // };
}

module.exports = SelectHandler;
