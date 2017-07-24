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
    var target = nums1.length > nums2.length ? nums1 : nums2;
    var donator= nums1.length > nums2.length ? nums2 : nums1;

    var tstart = 0, tend = target.length;
    var dstart = 0, dend = donator.length;

    while(dend - dstart > 2){
    	if((dend - dstart) % 2 == 1){ //if donator is oddnumber
    		var dmiddle = parseInt((dend - dstart) / 2) + 1;

    		if((tend - tstart) % 2 == 1){
    			var tmiddle = parseInt((tend - tstart) / 2) + 1;

    			if(target[tmiddle] > dmiddle[dmiddle]){ // 1/3/*5*/7/9 & 2/*4*/6
    				tstart -= (dmiddle - dstart);
    				dstart = dmiddle;
    			}
    			else{									// 1/3/*5*/7/9 & 4/*6*/8
    				tend += (dend - dmiddle + 1);
    				dend = dmiddle + 1;
    			}
    		}
    		else{
    			var tmiddle = [parseInt((tend - tstart) / 2) - 1, parseInt((tend - tstart) / 2)];

    			// 1/3/*5/7*/9/11 & 4/*6*/8 => 6
    			if(target[tmiddle[0]] <= donator[dmiddle] && donator[dmiddle] <= target[tmiddle[1]] )
    				return donator[dmiddle];
    			// 1/3/*5/7*/9/11 & 2/*4*/6
    			else if(target[tmiddle[0]] > donator[dmiddle]){
    				tstart -= (dmiddle - dstart);
    				dstart = dmiddle;
    			}
    			// 1/3/*5/7*/9/11 & 6/*8*/10
    			else{
    				tend += (dend - dmiddle + 1);
    				dend = dmiddle + 1;
    			}
    		}
    	}
    	else{ //if dnoator is even number
            var dmiddle = [parseInt((dend - dstart) / 2) - 1, parseInt((dend - dstart) / 2)];
            if((tend - tstart) % 2 == 1){
                var tmiddle = parseInt((tend - tstart) / 2) + 1;

                // 1/3/*5*/7/9 2/*4/6*/8
                if(donator[dmiddle[0]] <= target[tmiddle] && target[tmiddle] <= donator[dmiddle[1]] )
                    return target[tmiddle];
                // 1/3/*5*/7/9 4/*6/8*/10
                else if(tmiddle < donator[dmiddle[0]]){
                    tend += (dend - dmiddle[1] + 1);
                    dend = dmiddle[1] + 1;
                }
            }
    	}
    }
    if(dend - dstart == 2){

    }
    else if(dend - dstart == 1){

    }
    else{	//dend - dstart === 0

    }
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