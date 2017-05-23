'use strict';

//test call/apply/bind

(function(){
	var f = (function(){
		console.log(this);
		var x = 100;
		return function(){
			if(this && this.x) 
				return this.x++;
			else return x++;
		};
	})();
	
	console.log("before:" + f());
	
	var tmp = {};
	tmp.x = 2;
	console.log("call:" + f.call(tmp));
	
	console.log(tmp.x);
});

(function(){
	var ctor = function(){};
	
	ctor.prototype = {
		x : 100,
		f : function(){return this.x++;}
	};
	
	var o = new ctor();
	console.log(o.f());
	
	console.log(o.f.call({x:10}));
	console.log(o.f.call({}));
})();
