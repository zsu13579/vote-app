'use strict';

(function () {

   var voteList = document.querySelector('#voteList'); 
   var apiUrl = 'https://agile-dawn-14624.herokuapp.com/api/myvotes';

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
     var votesObject=[];
	  var data1=JSON.parse(data);
	  for(var i=0;i<data1.length;i++){
	   votesObject.push("<a href='/vote?voteName="+data1[i].voteName+"' class='list-group-item voteLink'>"+data1[i].voteName+"</a>");
	  }
     voteList.innerHTML = votesObject.join("");
   }

   ready(ajaxRequest('GET', apiUrl, updateVotes));

})();
