/*Given a string s, find the longest palindromic substring in s. You may assume that the maximum length of s is 1000.

Example:
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Example:
Input: "cbbd"
Output: "bb"*/

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
	debugger;
	var re = "";
    for(var i = 0; i < s.length ; i++){
    	var j;

    	//as middle  aba
    	for(j = 0; i - j >= 0 && i + j < s.length; j ++)
    		if(i-j < 0 || s[i-j] != s[i+j]){
    			break;
    		}
    	j--;
    	if(j >= 0){
    		var substring = s.slice(i-j, i+j+1);
    		if(substring.length > re.length)
    			re = substring;
    	}

    	//left
    	for(j = 0; i - j >= 0 && i + j - 1 < s.length; j ++)
    		if(i-j-1 < 0 || s[i-j-1] != s[i+j]){
    			break;
    		}
		j--;
    	if( j >= 0){
    		var substring = s.slice(i-j-1, i+j+1);
    		if(substring.length > re.length)
    			re = substring;
    	}

    }
    return re;
};

QUnit.test( "babccabcd", function( assert ) {
	var s      = "babccabcd"
	var expect = "bab";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "abxyxaa", function( assert ) {
	var s      = "abxyxaa"
	var expect = "xyx";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "xyxaa", function( assert ) {
	var s      = "xyxaa"
	var expect = "xyx";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "aaxyx", function( assert ) {
	var s      = "aaxyx"
	var expect = "xyx";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "aaxy", function( assert ) {
	var s      = "aaxy"
	var expect = "aa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "xyaa", function( assert ) {
	var s      = "xyaa"
	var expect = "aa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "xyaaxy", function( assert ) {
	var s      = "xyaaxy"
	var expect = "aa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "xyaaaaa", function( assert ) {
	var s      = "xyaaaaa"
	var expect = "aaaaa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "xyaaaaaxy", function( assert ) {
	var s      = "xyaaaaaxy"
	var expect = "aaaaa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "aaaaaxy", function( assert ) {
	var s      = "aaaaaxy"
	var expect = "aaaaa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});

QUnit.test( "aa", function( assert ) {
	var s      = "aa"
	var expect = "aa";
	var result = longestPalindrome(s);

	assert.ok( result == expect, s.toString() + " result:" + result.toString() + "  expect:" + expect.toString());
});