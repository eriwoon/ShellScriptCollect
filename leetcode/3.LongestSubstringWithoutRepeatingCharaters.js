/*Given a string, find the length of the longest substring without repeating characters.

* Examples:
* Given "abcabcbb", the answer is "abc", which the length is 3.
* Given "bbbbb", the answer is "b", with the length of 1.
* Given "pwwkew", the answer is "wke", with the length of 3. Note that the answer must be a substring, "pwke" is a subsequence and not a substring.*/

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
	//debugger;
    var max = 0;
	for(var start = 0, end = 0; end < s.length; end ++) {
		for(var i = start; i < end; i++){
			if(s[i] == s[end]){
				start = i + 1;
				break;
			}
		}

		max = end - start + 1 > max ? end - start + 1: max;
	}
	return max;
};

QUnit.test( "abcabcbb,3", function( assert ) {
	var s      = "abcabcbb";
	var expect = 3;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( "abcabcd,4", function( assert ) {
	var s      = "abcabcd";
	var expect = 4;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( ",0", function( assert ) {
	var s      = "";
	var expect = 0;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( "a,1", function( assert ) {
	var s      = "a";
	var expect = 1;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( "aaaaaa,1", function( assert ) {
	var s      = "aaaaaa";
	var expect = 1;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( "aaaaaabbbb,2", function( assert ) {
	var s      = "aaaaaabbbb";
	var expect = 2;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});

QUnit.test( "abcabcdefggabcde,7", function( assert ) {
	var s      = "abcabcdefggabcde";
	var expect = 7;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});
QUnit.test( "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz,26", function( assert ) {
	var s      = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";
	var expect = 26;
	var result = lengthOfLongestSubstring(s);

	assert.ok( result == expect, "Expect:" + expect + ", result:" + result);
});