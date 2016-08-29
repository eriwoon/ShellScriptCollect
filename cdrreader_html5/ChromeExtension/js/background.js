 var cururl = null;
 var rTitle = null;
 var bklist =[];
 var clist = [];
 var tlist = [];
 var nlist = [];
 var flist = [];
 var css = null;
 var js = null;
 var indport = null;

var log4js = new Log(Log.DEBUG, Log.remoteLogger);
log4js.debug("BGPage:background page js start");

chrome.storage.local.get({'bookmarks':[]}, function (result) {
    bklist = result.bookmarks;
});

$( document ).ready(function(){
});

chrome.runtime.onConnect.addListener(function(port){
    if(port.name=='contpage'){
        log4js.debug("BGPage:Enter message Listener, port.type=contpage.");
        indport = port;
        chrome.storage.local.get({"clist":[],"flist":[], "nlist":[], "tlist":[], "css":null, "js":null}, function (r) {
            clist = r.clist;    
            tlist = r.tlist;    
            nlist = r.nlist;    
            flist = r.flist;    
            css = r.css;    
            js = r.js;    
            log4js.debug("BGPage:trigger message, msg.type:cfg.");
            indport.postMessage({"type":"cfg", "clist":clist, "flist":flist, "nlist":nlist, "tlist":tlist, "css":css, "js":js});
            log4js.debug("BGPage:trigger message, msg.type:go.");
            indport.postMessage({"type":"go"});
        });
        indport.onMessage.addListener(function(msg){
            log4js.debug("BGPage:Enter message Listener, msg.type=updatebk.");
            console.log(msg);
            if(msg.type=="updatebk"){
                cururl = msg.cururl;
                rTitle = msg.rTitle;
                log4js.debug("BGPage:trigger message, msg.type:cfg.");
                indport.postMessage({"type":"cfg", "clist":clist, "flist":flist, "nlist":nlist, "tlist":tlist, "css":css, "js":js});
                updateBookmarks();
            }
        });

/*
        indport.onDisconnect.addListener(function(){
            indport = null;
            // Judge how similar the link will be
            bklist.push({rTitle:rTitle, cururl:cururl});
            chrome.storage.local.set({'bookmarks':bklist}, function () {
                console.info("Bookmarks Updated Done");
            });
            indport.postMessage({"type":"cfg", "clist":clist, "flist":flist});
        });
*/
    }
});


function updateBookmarks(){
    //Judge the page url?
    function sameNovel(u1,u2){
        var su1 = u1.split("/");
        var su2 = u2.split("/");
        //length:
        if(su1.length!=su2.length){
            return false;
        } else {
           var cr = true; 
           for(var i=0; i<su1.length-1; i++){
            if(su1[i] != su2[i]){
                cr = false;
                break;
            }
           }
           return cr;
        }
    };

    //
    for(var i=0;i<bklist.length;i++){
        console.log(bklist[i]);
        console.log(cururl);
       if(sameNovel(bklist[i].cururl, cururl)){
            bklist = bklist.slice(0,i).concat(bklist.slice(i+1, bklist.length));
            break;
       }
    };

    bklist.push({rTitle:rTitle, cururl:cururl});
    chrome.storage.local.set({'bookmarks':bklist}, function () {
        console.info("Bookmarks Updated Done");
    });
};


