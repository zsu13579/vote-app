'use strict';

// handle selectoption event
function SelectHandler (db) {
   var votes = db.collection('votes');
   
    this.getSelectChoices = function (req, res) {

     var selectProjection = { '_id': false };
	  var voteName=req.params.voteName;
     votes.find({"voteName":voteName}, selectProjection).toArray(function (err, result){
      if (err) {
            throw err;
         }
      // result: { "user" : "jacklv", "voteName" : "Sex", "options" : [ { "boy" : 0 }, { "girl" : 0 }, { "other" : 0 } ] }   
      res.send(JSON.stringify(result));     
      });  
   };

   this.addVote = function (req, res) {
	   var user=req.session.user;
      var newoptions=[];
      // title is same as voteName in this page
      var title=req.body.title;
      var selectoption=req.body.selectoption;
      var selectProjection = { '_id': false };
      votes.find({user:user,voteName:title}, selectProjection).toArray(function (err, result){
         if (err) {
               throw err;
            }
         // result: { "user" : "jacklv", "voteName" : "Sex", "options" : [ { "boy" : 0 }, { "girl" : 0 }, { "other" : 0 } ] }
         var options=result[0].options;
         options.forEach(function(value){
            var key=Object.keys(value)[0];
            if(key==selectoption){
               var tmp={};
               tmp[selectoption]=parseInt(value[key])+1;
               newoptions.push(tmp)
            }else{newoptions.push(value)}
         });
         var wherestr={user:user,voteName:title}; 
         var updatestr={$set:{options:newoptions}}
         votes.update(wherestr,updatestr,function(err,result){
            res.redirect("/vote/"+title)
         })  
      });
      
   };

   this.deleteVote = function (req, res) {
      var user=req.session.user;
      var voteName=req.body.title;
      votes.remove({"voteName":voteName}, function (err, result) {
         if (err) {
            throw err;
         }
         res.redirect("/pages/index");
      });  
   };
}

module.exports = SelectHandler;
