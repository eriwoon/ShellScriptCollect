/*
The string "PAYPALISHIRING" is written in a zigzag pattern on a given number of rows like this: (you may want to display this pattern in a fixed font for better legibility)

P   A   H   N
A P L S I I G
Y   I   R
And then read line by line: "PAHNAPLSIIGYIR"
Write the code that will take a string and make this conversion given a number of rows:

string convert(string text, int nRows);
convert("PAYPALISHIRING", 3) should return "PAHNAPLSIIGYIR".
*/


/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
	//init
	debugger;

	if(numRows == 1)
		return s;
	else if (numRows === 0)
		return;

    var lines = [];
    for(var i = 0; i < numRows; i++)
    	lines[i] = "";

    var flag = 0; //flag 0: trend down(PAY or ALI)   flag 1:trend top-rigth(YPA or ISH)  
    var curRow = 0;
    for(var i = 0; i < s.length; i++) {
    	if(flag == 0) {
    		lines[curRow] += s[i];
    		curRow ++;

    		if(curRow == numRows){
    			flag = 1;
    			curRow -= 2;
    		}
    	}
    	else {
    		lines[curRow] += s[i];
    		curRow --;

    		if(curRow == -1){
    			flag = 0;
    			curRow += 2;
    		}
    	}
    }

    var ret = [];
    for(var i = 0; i < numRows; i++) {
    	ret += lines[i];
    }

    return ret.toString();

};

(function(){
	var input   = "ABCDEFG";
    var numRows = 3;
    var expect  = "AEBDFCG";
    var result  = convert(input, numRows);
    var title   = "Input:" + input + ", numRows:" + numRows + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "PAYPALISHIRING";
    var numRows = 3;
    var expect  = "PAHNAPLSIIGYIR";
    var result  = convert(input, numRows);
    var title   = "Input:" + input + ", numRows:" + numRows + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "ABCDEFG";
    var numRows = 1;
    var expect  = "ABCDEFG";
    var result  = convert(input, numRows);
    var title   = "Input:" + input + ", numRows:" + numRows + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();

(function(){
	var input   = "ABCDEFG";
    var numRows = 100;
    var expect  = "ABCDEFG";
    var result  = convert(input, numRows);
    var title   = "Input:" + input + ", numRows:" + numRows + ", Expect:" + expect + ", Result:" + result;
	QUnit.test(title, function( assert ) {
    	assert.ok(expect == result, title); 
	});
})();
