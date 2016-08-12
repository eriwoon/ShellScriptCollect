'use strict';
/*global $ Log*/
window.log4js = (window.log4js || new Log(Log.DEBUG, Log.remoteLogger));

$().ready(function(){
  //bind click to clear
  $("#clear").click(function(){
    $.ajax({
      type: "delete",
      url: "//127.0.0.1/log/",
      success: function(){
        window.log4js.debug("LOG Page:clear clicked,result Success");
      },
      error: function(jqXHR,textStatus,errorThrown){
        window.log4js.debug("LOG Page:refresh clicked,result failed");
        console.log("remoteLogger Fail:");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
    window.location.reload(false);
  });
  
  $("#refresh").click(function(){
    window.log4js.debug("LOG Page:refresh clicked");
    refresh();
  });
  
  var refresh = function(){
    $.ajax({
      type:"get",
      url:"//127.0.0.1/log/content",
      success: function(data){
        window.log4js.debug("LOG Page:refresh clicked,result Success");
        var log = JSON.parse(data);
        for(var rec in log){
          var tr = $("#log").append(document.createElement("tr"));
          tr.append("<td class='date'>" + log[rec].date + "</td>");
          tr.append("<td class='level'>" + log[rec].level + "</td>");
          tr.append("<td class='msg'>" + log[rec].msg + "</td>");
        }
      },
      error: function(jqXHR,textStatus,errorThrown){
        window.log4js.debug("LOG Page:refresh clicked,result failed");
        console.log("remoteLogger Fail:");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }
});

