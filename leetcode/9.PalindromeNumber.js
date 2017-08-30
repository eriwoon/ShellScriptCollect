/*
Determine whether an integer is a palindrome. Do this without extra space.

click to show spoilers.

Some hints:
Could negative integers be palindromes? (ie, -1)

If you are thinking of converting the integer to string, note the restriction of using extra space.

You could also try reversing an integer. However, if you have solved the problem "Reverse Integer", you know that the reversed integer might overflow. How would you handle such case?

There is a more generic way of solving this problem.
*/

/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    //reverse
    if(x < 0) return false;

    var origin  = x;
    var reverse = 0;
    while(x > 0){
    	reverse = reverse * 10 + x % 10;
    	x = parseInt(x / 10);
    }

    if(origin == reverse)
    	return true;
    else
    	return false;
};


(function(){
	var input   = 123456;
	var expect 	= false;
    var result  = isPalindrome(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
    var input   = 123321;
    var expect  = true;
    var result  = isPalindrome(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
    QUnit.test(title, function( assert ) {
        assert.ok(expect == result, title); 
    });
})();

(function(){
    var input   = 0;
    var expect  = true;
    var result  = isPalindrome(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
    QUnit.test(title, function( assert ) {
        assert.ok(expect == result, title); 
    });
})();

(function(){
    var input   = -123321;
    var expect  = false;
    var result  = isPalindrome(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
    QUnit.test(title, function( assert ) {
        assert.ok(expect == result, title); 
    });
})();

(function(){
    var input   = 73842;
    var expect  = false;
    var result  = isPalindrome(input);
    var title   = "Input:" + input + ", Expect:" + expect + ", Result:" + result;
    QUnit.test(title, function( assert ) {
        assert.ok(expect == result, title); 
    });
})();