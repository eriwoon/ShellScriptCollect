'use strict'

var log4js = new Log(Log.DEBUG, Log.remoteLogger);

console.log("test new console.log")
$(document).ready(function(){
  $("#btnRead").click(function(){
    log4js.debug("pupup:btn Read Clicked.");
    chrome.tabs.query({active:true}, function(tab){
      log4js.debug("pupup: run function in query");
      chrome.tabs.executeScript(tab[0].id, {file:"js/jquery-3.1.0.min.js"});
      chrome.tabs.executeScript(tab[0].id, {file:"js/log4js.js"});
      chrome.tabs.executeScript(tab[0].id, {file:"js/inject.js"});
      chrome.tabs.insertCSS(tab[0].id, {file:"css/inject.css"});
    });
  });
  $("#btnBookmark").click(function(){
    log4js.debug("btn Bookmark Clicked.");
  });
});

