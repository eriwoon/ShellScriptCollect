/*
Implement atoi to convert a string to an integer.

Hint: Carefully consider all possible input cases. If you want a challenge, please do not see below and ask yourself what are the possible input cases.

Notes: It is intended for this problem to be specified vaguely (ie, no given input specs). You are responsible to gather all the input requirements up front.

Update (2015-02-10):
The signature of the C++ function had been updated. If you still see your function signature accepts a const char * argument, please click the reload button  to reset your code definition.
*/

/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
    var ret = 0;

    /*
    //remove space
    var new_str = "";
    for(var i = 0; i < str.length; i++)
    	if(str[i] != ' ')
    		new_str += str[i];
    str = new_str;*/
    // I have no idea what excatly they want!!! shitty requirement
    var new_str = "";
    for(var i = 0; i < str.length; i++) {
    	if(str[i] != " ")
    		break;
    } 

    /*
    // calculate + and -
    var flag = 1, i = 0;
    for(; i < str.length; i++)
    	if(str[i] != "-" && str[i] != "+")
    		break;
    	else if(str[i] == "-")
    		flag = 0 - flag;*/

    var flag = 1;
    if(str[i] == '-') {
    	flag = -1;
    	i ++;
    }
    else if (str[i] == "+"){
    	i ++;
    }


    for(; i < str.length; i++) {
    	if(i === 0){
    		if(str[0] == "+")
    			continue;
    		else if(str[0] == "-"){
    			flag = 1;
    			continue;
    		}
    	}
    	var cur = str.charCodeAt(i);
    	if(cur < 48 || cur > 57)
    		break;
    	else{
    		ret = ret * 10 + cur - 48;
    	}
    }

    ret = flag * ret;

    if(ret > 2147483647)
    	return 2147483647;
    else if ( ret < -2147483648)
    	return -2147483648;
    else
    	return ret;
    
};

(function(){
	var input   = "12397891";
    var expect  = 12397891;
    var result  = myAtoi(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "+12397891";
    var expect  = 12397891;
    var result  = myAtoi(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "-12397891";
    var expect  = -12397891;
    var result  = myAtoi(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();


(function(){
	var input   = " -123 97 8 9  1";
    var expect  = -123;
    var result  = myAtoi(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "-+ -+-  12397 891  ";
    var expect  = 0;
    var result  = myAtoi(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();