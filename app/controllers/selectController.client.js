'use strict';

(function () {
   // var tmp=$("h3").val();
   // $("#piechar").html(tmp);

   var voteName=$("h3").text();
   var piechar=document.getElementById('piechar');
   // var homeButton = document.querySelector('.btn-home');
   // var signButton = document.querySelector('.btn-sign');
   // var addButton = document.querySelector('.btn-add');
   // var deleteButton = document.querySelector('.btn-delete');
   // var voteList = document.querySelector('#voteList');
   // var test = document.querySelector('#test');
   var apiUrl = 'http://localhost:3000/api/selectvotes/'+voteName;
   
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

       var key=[];   
       var data=JSON.parse(data);
       var options=[];
       data[0].options.forEach(function(val){
         key.push(Object.keys(val)[0]);
         // val.push(value[Object.keys(value)]);
         options.push({name:Object.keys(val)[0],value:val[Object.keys(val)]})
       });
       // // $("#piechar").html(voteName);
       var myChart = echarts.init(piechar);
       
       var option={
         tooltip : {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
              x : 'center',
              y : 'bottom',
              data: key
          },
          toolbox: {
              show : true,
              feature : {
                  mark : {show: true},
                  dataView : {show: true, readOnly: false},
                  magicType : {
                      show: true,
                      type: ['pie', 'funnel']
                  },
                  restore : {show: true},
                  saveAsImage : {show: true}
              }
          },
          calculable : true,
          series : 
              {
                  name: 'Vote',
                  type: 'pie',
                  data: options
              }
       }

       myChart.setOption(option);
       
   }

   ready(ajaxRequest('GET', apiUrl, updateVotes));

   addButton.addEventListener('vote', function () {

      ajaxRequest('POST', apiUrl, function () {
         ajaxRequest('GET', apiUrl, updateVotes);
      });

   }, false);

   // deleteButton.addEventListener('vote', function () {

      // ajaxRequest('DELETE', apiUrl, function () {
         // ajaxRequest('GET', apiUrl, updateVotes);
      // });

   // }, false);

})();
