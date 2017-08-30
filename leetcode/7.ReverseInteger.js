/*
Reverse digits of an integer.

Example1: x = 123, return 321
Example2: x = -123, return -321

Note:
The input is assumed to be a 32-bit signed integer. Your function should return 0 when the reversed integer overflows.
*/

/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    if(x > 2147483647 || x < -2147483648)
    	return 0;

    n = [];
    var flag = 0;

    if(x < 0){
    	flag = 1;
    	x = 0 - x;
    }
    
    while(x > 0) {
    	n.push(x % 10);
    	x = parseInt(x / 10);
    }

    var ret = 0;
    for(var i = 0; i < n.length; i++) {
    	ret = ret * 10 + n[i];
    }

    if(flag == 1)
    	ret = 0 - ret;

    if(ret > 2147483647 || ret < -2147483648)
    	return 0;

    return ret;
};


(function(){
	var input   = 123456;
    var expect  = 654321;
    var result  = reverse(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = -123456;
    var expect  = -654321;
    var result  = reverse(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = 0;
    var expect  = 0;
    var result  = reverse(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = 12345678901234567890;
    var expect  = 0;
    var result  = reverse(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();