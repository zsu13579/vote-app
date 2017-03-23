'use strict';

(function () {

   var homeButton = document.querySelector('.btn-home');
   var signButton = document.querySelector('.btn-sign');
   var addButton = document.querySelector('.btn-add');
   var deleteButton = document.querySelector('.btn-delete');
   var voteList = document.querySelector('#voteList');
   var apiUrl = 'http://localhost:3000/api/votes';

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
      var votesObject = JSON.parse(data) //.map(x => x.voteName);
      voteList.innerHTML = votesObject[0].voteName;
   }

   ready(ajaxRequest('GET', apiUrl, updateVotes));

   addButton.addEventListener('vote', function () {

      ajaxRequest('POST', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateVotes);
      });

   }, false);

   deleteButton.addEventListener('vote', function () {

      ajaxRequest('DELETE', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateVotes);
      });

   }, false);

})();
