/* You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

* You may assume the two numbers do not contain any leading zero, except the number 0 itself.

* Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)
* Output: 7 -> 0 -> 8
*/

/**
 * Definition for singly-linked list.*/
 function ListNode(val) {
    this.val = val;
    this.next = null;
 }
 
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

var compose = function(list) {
	var first = new ListNode(list[0]);
	var pre = first;
	
	for(var i = 1; i < list.length; i ++) {
		pre.next = new ListNode(list[i]);
		pre = pre.next;
	}
	
	return first;
};

var decompose = function(inlist){
	var cur = inlist;
	var ret = [];
	
	do {
		ret.push(cur.val);
		cur = cur.next;
	} while (cur !== null);
	
	return ret;
};

var addTwoNumbers = function(inl1, inl2) {
	var compose = function(list) {
		var first = new ListNode(list[0]);
		var pre = first;
		
		for(var i = 1; i < list.length; i ++) {
			pre.next = new ListNode(list[i]);
			pre = pre.next;
		}
		
		return first;
	};

	var decompose = function(inlist){
		var cur = inlist;
		var ret = [];
		
		do {
			ret.push(cur.val);
			cur = cur.next;
		} while (cur !== null);
		
		return ret;
	};

	var l1 = decompose(inl1);
	var l2 = decompose(inl2);
	var length = l1.length > l2.length ? l1.length : l2.length;
	var ret = [];

	var carrier = 0;
	for(var i = 0; i <= length; i ++) {
		var addend1 = i < l1.length ? l1[i] : 0;
		var addend2 = i < l2.length ? l2[i] : 0;
		var sum = addend1 + addend2 + carrier;

		if(sum >= 10){
			sum -= 10;
			carrier = 1;
		}
		else
			carrier = 0;

		if(i == length && i !== 0 && sum === 0)
			break;
		
		ret.push(sum);
	}
	return compose(ret);
};

var validate = function(expect, result){
	if(expect.length != result.length) return false;

	for(let i = 0; i < expect.length; i++)
		if(expect[i] != result[i])
			return false;
	return true;
}

QUnit.test( "Example", function( assert ) {
	var l1     = compose([2, 4, 3]);
	var l2     = compose([5, 6, 4]);
	var expect = compose([7, 0, 8]);
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(decompose(expect), decompose(result)),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "Example", function( assert ) {
	var l1     = compose([1, 2, 3, 9, 9, 9]);
	var l2     = compose([9, 8, 7]);
	var expect = compose([0, 1, 1, 0, 0, 0, 1]);
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(decompose(expect), decompose(result)),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "Example", function( assert ) {
	var l1     = compose([1, 2, 3, 9, 9, 8]);
	var l2     = compose([9, 8, 7]);
	var expect = compose([0, 1, 1, 0, 0, 9]);
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(decompose(expect), decompose(result)),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "Example", function( assert ) {
	var l1     = compose([9, 8, 7]);
	var l2     = compose([1, 2, 3, 9, 9, 9]);
	var expect = compose([0, 1, 1, 0, 0, 0, 1]);
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(decompose(expect), decompose(result)),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "Example", function( assert ) {
	var l1     = compose([0]);
	var l2     = compose([0]);
	var expect = compose([0]);
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(decompose(expect), decompose(result)),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

/*QUnit.test( "例子", function( assert ) {
	var l1     = [2, 4, 3];
	var l2     = [5, 6, 4];
	var expect = [7, 0, 8];
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(expect, result),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "长短并且进位", function( assert ) {
	var l1     = [1, 2, 3, 9, 9, 9];
	var l2     = [9, 8, 7];
	var expect = [0, 1, 1, 0, 0, 0, 1];
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(expect, result),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "长短但不进位", function( assert ) {
	var l1     = [1, 2, 3, 9, 9, 8];
	var l2     = [9, 8, 7];
	var expect = [0, 1, 1, 0, 0, 9];
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(expect, result),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "短长并进位", function( assert ) {
	var l1     = [9, 8, 7];
	var l2     = [1, 2, 3, 9, 9, 9];
	var expect = [0, 1, 1, 0, 0, 0, 1];
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(expect, result),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});

QUnit.test( "0+0", function( assert ) {
	var l1     = [0];
	var l2     = [0];
	var expect = [0];
	var result = addTwoNumbers(l1, l2);

	assert.ok( true == validate(expect, result),
		l1.toString() + " + " + l2.toString() + " = " + result.toString() + " expect:" + expect.toString());
});*/