'use strict';

var express = require("express");
var bodyParser = require('body-parser');
var jade = require("jade");

var app = express();
app.use(bodyParser.json());   
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/log", function(req, res, next){
  res.header("Access-Control-Allow-Headers", "Origin, X-Request-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

var getDate = function(){
  var d = new Date();
  var h = d.getHours();
  if (h<10) { h="0"+h; }
  var m = d.getMinutes();
  if (m<10) { m="0"+m; }
  var s = d.getSeconds();
  if (s<10) { s="0"+s; }
  return (h+":"+m+":"+s);

}

app.set('view engine', 'jade');
//Add static file directory
app.use(express.static(__dirname + '/client'));

var log = [];
log.push({date:getDate(),level:"INFO Server",msg:"Start loging..."});

app.get("/log", function(req,res){
  //send html to client
  //log.push({date:getDate(),level:"INFO Server",msg:"Received GET request to /log."});
  var fn = jade.compileFile("view/log.jade",{});
  var html = fn({"log":log});
  res.send(html);
});

app.get("/log/content", function(req,res){
  //send log variable to client
  //called by ajax at client side
  //log.push({date:getDate(),level:"INFO Server",msg:"Received GET request to /log/content."});
  res.send(JSON.stringify(log));
});

app.post("/log", function(req,res){
  log.push(req.body);
  res.send(JSON.stringify({status:200}));
});

app.delete("/log",function(req,res){
  log = [];
  log.push({date:getDate(),level:"INFO Server",msg:"Received DELETE request to /log."});
  res.send(JSON.stringify({status:200}));
})

var server = app.listen(process.env.PORT || 80,function(){
  console.log("Server Started, listening on port 80...");
});
