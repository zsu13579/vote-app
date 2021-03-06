'use strict';

(function () {

   var homeButton = document.querySelector('.btn-home');
   var signButton = document.querySelector('.btn-sign');
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var voteList = document.querySelector('#voteList');
   var voteLink = document.querySelector('.voteLink');
   var git = document.querySelector('#git');   
   var apiUrl = 'https://agile-dawn-14624.herokuapp.com/api/votes';

   function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   }

   function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }

   function updateVotes (data) {
	 // var user=req.session.user;
     var votesObject=[];
	  var data1=JSON.parse(data);
	  for(var i=0;i<data1.length;i++){
	   votesObject.push("<a href='/vote?voteName="+data1[i].voteName+"&user="+data1[i].user+"' class='list-group-item voteLink'>"+data1[i].voteName+"</a>");
	  }
     voteList.innerHTML = votesObject.join("");
   }

   ready(ajaxRequest('GET', apiUrl, updateVotes));

   // voteLink.addEventListener('vote', function () {

   //    ajaxRequest('POST', apiUrl, function () {
   //       // ajaxRequest('GET', apiUrl, updateVotes);
   //    });

   // }, false);
   
    // git.addEventListener('vote', function () {

       // ajaxRequest('POST', apiUrl, function () {
          // // ajaxRequest('GET', apiUrl, updateVotes);
       // });

    // }, false);

   addButton.addEventListener('vote', function () {

      ajaxRequest('POST', apiUrl, function () {
         // ajaxRequest('GET', apiUrl, updateVotes);
      });

   }, false);

   deleteButton.addEventListener('vote', function () {

      ajaxRequest('DELETE', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateVotes);
      });

   }, false);

})();
