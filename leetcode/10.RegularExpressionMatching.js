/*
Implement regular expression matching with support for '.' and '*'.

'.' Matches any single character.
'*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).

The function prototype should be:
bool isMatch(const char *s, const char *p)

Some examples:
isMatch("aa","a") → false
isMatch("aa","aa") → true
isMatch("aaa","aa") → false
isMatch("aa", "a*") → true
isMatch("aa", ".*") → true
isMatch("ab", ".*") → true
isMatch("aab", "c*a*b") → true
*/

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {
    //Analyze the pattern
    sp = [];
    for(let i = 0; i < p.length; i++){
    	if(p[i] != '*')
    		sp.push(p[i]);
    	else {
    		if(sp.length === 0 || sp[sp.length - 1].star === undefined)
    			return
    		sp[sp.length - 1].star = true;
    	}
    }
    console.log(sp);


};