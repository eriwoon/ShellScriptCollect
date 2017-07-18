#! /usr/bin/nodejs

(function(){
	var a = "2";
	var b = 3;
	console.log(a+b); //23
	console.log(b+a); //32

	console.log(parseInt(a) + b); //5

	a = "2.3";
	console.log(parseInt(a) + b); //5
	console.log(parseFloat(a) + b);  //5.3

	a = "3.2";
	console.log(typeof(a)); //string
	console.log(typeof(parseFloat(a)));
})();

(function(){
	var c = function(s){this["i"] = s;};
	c.prototype.calc = function(d){
		if(d)
			return d;
		else
			return this;
	};
	c.prototype.print = function(){console.log(this.i)};

	var ins1 = new c("ins1");
	var ins2 = new c("ins2");

	ins1.calc(false).print();
	ins1.calc(ins2).print();


});


(function(){
	console.log("Hello world!");

	var tmp = [];
	tmp[100] = 100;

	console.log(tmp.length);
	console.log(tmp["100"] === tmp[100]);

	Array.prototype.lengthExt = function(){
		var l = 0;
		console.log("Enter function lengthExt.");
		for(let i in this)
		{
			console.log(i);
			console.log(this[i]);
			l ++;
		}
		return l;

	}
	
	//Object.defineProperty(Array.prototype, "lengthExt", {enumerable:false});
	console.log(tmp.lengthExt())
	console.log(Object.keys(tmp));

});