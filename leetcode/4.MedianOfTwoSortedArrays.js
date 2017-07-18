/*There are two sorted arrays nums1 and nums2 of size m and n respectively.

Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

Example 1:
nums1 = [1, 3]
nums2 = [2]

The median is 2.0
Example 2:
nums1 = [1, 2]
nums2 = [3, 4]

The median is (2 + 3)/2 = 2.5*/

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    return 2;
};

var calc = function(num1, num2){
	var sortby = function(l, r){return l - r;}
	var sum = num1.concat(num2).sort(sortby);
	console.log(sum);
	if(sum.length % 2 == 1)
		return sum[parseInt(sum.length/2)];
	else
		return (sum[parseInt(sum.length/2) - 1] + sum[parseInt(sum.length/2)])/2;
};

QUnit.test( "Example", function( assert ) {
	var num1   = [1, 3];
	var num2   = [2];
	var expect = calc(num1, num2);
	var result = findMedianSortedArrays(num1, num2);

	assert.ok(( expect == result ),	"Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
	var num1   = [1, 3, 5, 7];
	var num2   = [2, 4, 6, 8];
	var expect = calc(num1, num2);
	var result = findMedianSortedArrays(num1, num2);

	assert.ok(( expect == result ),	"Expect:" + expect + ", Result:" + result);
});