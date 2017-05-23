'use strict';

var cururl = window.location.href;

$(function(){
  handlePage();
});

/*Get all the data in body
*/
var handlePage = function(){

  var title = getTitle($('body'));
  var navBar= getNavBar($('body'));
  var content = getContent($('body'));

  rewritePage(title, navBar, content); 
};

var rewritePage = function(title, navBar, content){
  $('body').empty();
  $('body').attr('style','');
  $('body').append('<div id="xz_full"></div>');
  
  //title
  
  $('#xz_full').append('<nav id="xz_title" class="navbar navbar-inverse navbar-fixed-top"></nav>');
  $('#xz_title').append('<div id="xz_title_container" class="container-fluid">');
  $('#xz_title_container')
    .append('<a class="navbar-brand" href=' + cururl + '>' + title + '</a>')
    .append('<div id="xz_title_collapse" class="collapse navbar-collapse"></div>');
  $('#xz_title_collapse').append('<p class="navbar-text navbar-right"><a class="navbar-link" href=' + navBar + '>下一章</a></p>'); 

  //content
  $('#xz_full').append('<div id="xz_content"></div>')
  $('#xz_content').append(content);
  $('#xz_content').find('a').remove();  
  $('#xz_content').find('[style]').removeAttr('style');
  $('#xz_content').find('[class]').removeAttr('class');
  $('#xz_content').find('[id]').removeAttr('id');
  $('#xz_content').find('[onkeydown]').removeAttr('onkeydown');
  $('#xz_content').css({
    "padding": "8%",
    "font-size":"20px",
    "line-height": "28px",
    "background-color": "#FAF7ED",
    'font-family': '"Helvetica Neue",Verdana,Arial,"Hiragino Sans GB","WenQuanYi Micro Hei","Heiti SC",STHeiti,"Microsoft Yahei",SimSun,sans-serif'
  });

  //navigator
  /*
  $('#xz_full').append('<a type="button" id="xz_nav_button" class="btn btn-default btn-inverse" href="' +navBar+'">下一章</a>');
  $('#xz_nav_button').css({
    "position":"fixed",
    "right":"0px",
    "bottom":"10px",
  });*/

};



var getContent = function(context){
  var DivArray = [];
  //find all the DIVs and its P/SPAN/BR, then sort
  $("div", context).each(function(i){
    DivArray.push({div: $(this), num: $("p,span,br",$(this)).length});
  });
  DivArray = DivArray.filter(function(x){return x.num});
  DivArray = DivArray.sort(function(a,b){return a.num < b.num});

  //Remove the num of P/SPAN/BR who belongs to child-DIV
  DivArray.forEach(function(x,i,a){
    for(i = i + 1 ; i<a.length ; i++)
      for(var iter = 0,p = a[i].div.parents(); iter < p.length; iter++) 
        if(x.div.is($(p[iter])))
          x.num -= a[i].num;
  });

  //return the DIV who has the most P/SPAN/BR
  return DivArray.reduce(function(x,y) { return (x.num>y.num) ? x:y;}).div;
};

var getNavBar = function(context){
  var cNextReg = '.*[下|后]\s*一*\s*[章|回|页|节].*';
  //cNavNext = ctn.find("span, a, button").filter(function(){return $(this).text().match('.*[下|后]\s*一*\s*[章|回|页|节].*')!=null;}).filter(':last');
  var nav = context
    .find("span, a, button")
      .filter(function(){return ($(this).is('[href]') && ($(this).text().match(cNextReg)!=null));})
        .filter(':last');
  return nav.attr('href');
};

var getTitle = function(context){
  var title = [];
  if(title.length==0)
    title = context.find(":header").filter(function(){return $(this).text().match('.*章')!=null;}).filter(':first');
  if(title.length==0)
    title = context.find(":header").filter(function(){return $(this).text().match('.*节')!=null;}).filter(':first');
  if(title.length==0)
    title = context.find(":header").filter(function(){return $(this).text().match('.*回')!=null;}).filter(':first');
  if(title.length==0)
    title = context.find(":header").eq(0);
  if(title.length==0)
    title = context.find("strong").eq(0);

  return title.html();
};

