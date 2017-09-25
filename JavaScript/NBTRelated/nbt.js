var nbtjs = {
	version: "1.0",
	author: "eric.xiaozhen@foxmail.com",
	license: "MIT"
}

//output format
nbtjs.nbtfmt = function(){}
nbtjs.nbtfmt.prototype.name  = null;
nbtjs.nbtfmt.prototype.type  = null;
nbtjs.nbtfmt.prototype.value = null;
nbtjs.nbtfmt.prototype.child = [];

nbtjs.decode = function(str){
	
}

var blob = new Blob(['Hello World']);
console.log(blob)