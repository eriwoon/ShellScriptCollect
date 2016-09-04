'use strict';
/*global $ Log*/
window.log4js = (window.log4js || new Log(Log.DEBUG, Log.remoteLogger));
window.log4js.debug = function(){};
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
    refresh();
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

        //remove current trs
        $("#log tr.c").remove();

        for(var rec = log.length - 1 ; rec >= 0; rec --){
          var tr = $("#log").append("<tr class='c'>" +
            "<td class='date'>" + log[rec].date + "</td>" +
            "<td class='level'>" + log[rec].level + "</td>" + 
            "<td class='msg'>" + log[rec].msg + "</td>" + "</tr>");
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

  var periodicRefresh = function(time){
    refresh();
    setTimeout(periodicRefresh, time || 300);
  };
  periodicRefresh();
});

