'use strict';

var log4js = new Log(Log.DEBUG, Log.popupLogger);
log4js.debug("inject start")


var targets = null;
var port = chrome.extension.connect({name: "contpage"});
var cururl = window.location.href;
var rTitle = null;
var rflist = [];
var rclist = [];
var rtlist = [];
var rnlist = [];
var rjs = null;


console.log("Enter Page Pre");
//cururl = root.cururl;
// Main function (Should be used recursively)

port.onMessage.addListener(function(msg){
   console.log(msg);
   if(msg.type == 'cfg'){
        rflist = msg.flist;
        rclist = msg.clist;
        rtlist=  msg.tlist;
        rnlist=  msg.nlist;
        rjs =  msg.js;
   };
   if(msg.type=="go"){
        handlePage();
   };
});



$( document ).ready(function(){
    var lastScrollTop = 0;
    console.log("Enter Page");
    $(window).scroll(function(event){
       var st = $(this).scrollTop();
       if (st > lastScrollTop){
           console.log('d');// downscroll code
            $('#lrbk_title').hide();
       } else {
          console.log('u');// upscroll code
          $('#lrbk_title').show();
       }
       lastScrollTop = st;
    });

});


var handlePage    = function(pageurl){
    var r = $('body').html();
    handleContent(r);
    if(rjs!=null && rjs != ""){
        eval(rjs);
    }
    rewritePage(targets); 
};

var handleContent = function(bodytxt){
	         //console.log(response.responseText);
            dummy = $("<div id='dummy'></div>");
            dummy.append(bodytxt);

			//Remove script
			dummy.find('script').remove();
			//Remove redundancy
			dummy.find('link').remove();
			dummy.find('ins').remove();
	
			//Remove items
//			dummy.find('table').remove();
//			dummy.find('tr').remove();
//			dummy.find('td').remove();
			//dummy.find('br').remove();
            $('table').filter(function(index){
                if($(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')) {
                    return false;
                } else {
                    return true;
                }
            }).remove();
 
	        $('tr').filter(function(index){
                if($(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')) {
                    return false;
                } else {
                    return true;
                }
            }).remove();

	        $('td').filter(function(index){
                if($(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')) {
                    return false;
                } else {
                    return true;
                }
            }).remove();

 			
            var cbody =  dummy;
            var jres = judgePage(cbody);
            //console.log(jres);
            //console.log(cbody.text());
            if(jres[0]){
                // Your code here...
                cbody.find('iframe').remove();
                cbody.find('iframe').css('display','none!important');
                console.log("Suppose it is in one Novel Page, I guess.");
                //To extract the content and navigations
                targets = nextractContent(cbody);
				// Got the next page's key info
           } else {
                console.log("Not one Novel Page, I guess.["+jres[1]+"]");
           }
};

var rewritePage = function(wctn) {
    $('body').empty();
    $('body').attr('style','');
    //Title
    $('body').append('<div id="lrbk_title"></div>');
    $('#lrbk_title').append(wctn[0]);

    $('#lrbk_title').click(function(){
        window.location.href=cururl;
    });


    //Content
    $('body').append(wctn[4]);
    $('body').find('a').remove();
    
    //Navigation
    var nv = $("<div id='nav'></div>");
    nv.append("<tr><td><span class='fetchnext' style='cursor:pointer;' href='"+ urlProceed(wctn[3][0].getAttribute('href')) +"'>"+"下一章"+"</span></td></tr>");
    $('body').append(nv);
    $('body').find('[style]').removeAttr('style');
    $('body').find('[onkeydown]').removeAttr('onkeydown');
	
	
   $('body').append("<iframe id='npage' style='display:none;' src='"+urlProceed(wctn[3][0].getAttribute('href')) +"'></iframe>")

	
	// Go to top
	window.scrollTo(0,0);
	//For next page's info
	$('.fetchnext').unbind('click').bind('click', function(){
            rTitle = document.getElementById('npage').contentWindow.document.head.getElementsByTagName("title")[0].innerHTML;
			loadNextPage();
	});


    $(document).keyup(function(e){
        console.log(e.keyCode);
        if(e.keyCode==186){
            rTitle = document.getElementById('npage').contentWindow.document.head.getElementsByTagName("title")[0].innerHTML;
			loadNextPage();
        }
    });
    //
    if(rTitle!=null)
        $('title').text(rTitle);
    else
        rTitle = $('title').text();
        
    //cururl = window.location.href;
    port.postMessage({type:"updatebk", rTitle: rTitle, cururl: cururl});
};

var urlProceed = function(u){
    // in content_script version, don't need handling
    return u;

};


var loadNextPage = function(){
	// Get content from iframe
    cururl = $('#npage').prop('src');
	handleContent(document.getElementById('npage').contentWindow.document.body.innerHTML);
	rewritePage(targets); 
};

var judgePage = function(txt){
    var btxt =txt;
    var ctype = 0b000;
    var res = false;
    /*
        HB:    Prev
        MB:    Index     //Now ignored
        LB:    End
    */

  
    console.log("To judge if this page supposed to be one novel page    ... ... ");
    //1. If index info there?
    // a. pre-index-next
    if(btxt.text().match('.*目\s*录.*') || btxt.text().match('.*列\s*表.*'))
        ctype = ctype | 0b010
    if(btxt.text().match('.*[上|前]一*[节|章|回|页].*'))
        ctype = ctype | 0b100
    if(btxt.text().match('.*[下|后]一*[节|章|回|页].*'))
        ctype = ctype | 0b001
       
//  Without Index       
//    if((ctype & 010) != 010) {
//       res = false;
//   No any pre and next        
//    }else if((ctype & 101 )== 000){
//        res = false;
//    } else {

    if((ctype & 0b101 )== 0b000){
        res = false;
    } else {
        res = true;
    }
    return [res,ctype];
};


var nextractContent = function(ctn) {
    //1. current idea, to locate where is the title? where is the nav part? and then to grab the text between them
    //0: page title

    //a: Title
    var cTitle = [];

    // All possible title filter, With higher priority
    $.each(rtlist,function(i,v){
        if(ctn.find(v).length>0){
            cTitle = ctn.find(v).eq(0);
        }
    });
    if(cTitle.length==0)
        cTitle = ctn.find(":header").filter(function(){return $(this).text().match('.*章')!=null;}).filter(':first');
    if(cTitle.length==0)
        cTitle = ctn.find(":header").filter(function(){return $(this).text().match('.*节')!=null;}).filter(':first');
    if(cTitle.length==0)
        cTitle = ctn.find(":header").filter(function(){return $(this).text().match('.*回')!=null;}).filter(':first');
    if(cTitle.length==0)
        cTitle = ctn.find(":header").eq(0);
   if(cTitle.length==0)
        cTitle = ctn.find("strong").eq(0);

    
    //b: Nav
    var cNavNext    = [];
    // If customized
    // All possible title filter, With higher priority
    $.each(rnlist,function(i,v){
        if(ctn.find(v).length>0){
            cNavNext = ctn.find(v).eq(0);
        }
    });

    if(cNavNext.length==0) {
        var cNextReg = '.*[下|后]\s*一*\s*[章|回|页|节].*';
        //cNavNext = ctn.find("span, a, button").filter(function(){return $(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')!=null;}).filter(':last');
        cNavNext = ctn.find("span, a, button").filter(function(){return ($(this).is('[href]') && ($(this).text().match(cNextReg)!=null));}).filter(':last');
        if(cNavNext.length==0)
            cNavNext = ctn.find("span, a, button").filter(function(){return ($(this).is('[href]') && $(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')!=null);}).filter(':last');
    }
    //c: Content
    // Remove all items before title:
    // - remove all slibing in same parent
    var chdl = cTitle;
    while(chdl.length > 0 ){
        console.log("Remove - ");
        chdl.prevAll().remove();
        chdl = chdl.parent();
   }
   chdl = cNavNext;
    while(chdl.length > 0 ){
        console.log("Remove - ");
        chdl.nextAll().remove();
        chdl = chdl.parent();
   }
   
   //Clean further
    $('link').remove();
    $('script').remove();
    $('table').filter(function(index){
        if($(this).text().match('.*[下|后]\s*一*\s*[章|回|页].*')) {
            return false;
        } else {
            return true;
        }
    }).remove();
    
    //var retarr = [cTitle.clone(), cNavIndex.clone(), cNavPrev.clone(), cNavNext.clone(), null];
    //var retarr = [cTitle.clone(), null, null, cNavNext.clone(), null];
    var retarr = [cTitle.text(), null, null, cNavNext.clone(), null];
    // To remove all other element
    cTitle.remove();
    //cNavIndex.remove();
    //cNavPrev.remove();
    cNavNext.remove();
    
    var cContent = $("<div id='nctn'></div>");
    
    //Grab the content part:
    // 1. take key words, and judge if length is enough, if yes, no any action , if not, then to take it directly
    // Key words
    //cContent.append(ctn.find('* ').clone());
    var cSec = null;
    //Custome clist
    clist = ["#nctn", "#content", ".content", "#chaptercontent", "#readtxt", "#chapterContentWapper"];
    clist = clist.concat (rclist);
    // All possible key content
    cSec = ctn;
    $.each(clist,function(i,v){
        if(ctn.find(v).length>0){
            cSec = ctn.find(v);
        }
    });
    if(cSec.text().length<10) {
        cSec = ctn;
    };
    cContent.append(cSec.clone());
   
    //var citems = $('body > * ');
    //cContent.append(citems);
    
    var rtContent = $("<div id='gnContent'></div>");
    rtContent.append(cContent);
    // Clean work
    rtContent.find('script').remove();
    rtContent.find('*').prop('onclick',null).off('click');

    //flist
    flist = [ "[id*=comment]","[id*=info]","[id*=thumb]","[id*=meta]","[class*=comment]","[class*=info]","[class*=thumb]","[class*=meta]", "ul", "#readtop",".top", "#readview", ".button", ".qrcode"];
    flist = flist.concat(rflist);
    // General 
    $.each(flist, function(i,v){
        if(rtContent.text().replace(/\s+/g,"") != rtContent.find(v).text().replace(/\s+/g,"")){
            if(rtContent.text().replace(/\s+/g,"").length - rtContent.find(v).text().replace(/\s+/g,"").length > 10 ){
                rtContent.find(v).remove();
            }
        };
    });
    // Zongheng
    rtContent.find('[class*=pray_pc]').remove();


    /* 
    --------
    Patch Area
    --------
    */
    // Patch Pre!
    rtContent.find('pre').replaceWith(function(){
        return $("<div />", {html: $(this).html().replace(/\n/g,"<br><br>")});
    });



 
 /* Debug Purpose
   cTitle.css('background', 'red'); 
   cNavPrev.css('background', 'yellow'); 
   cNavNext.css('background', 'blue'); 
   cNavIndex.css('background', 'grey'); 
*/

    
    retarr[4] = rtContent;
    return retarr;
    
}
