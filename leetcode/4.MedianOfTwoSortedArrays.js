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
    debugger;

    var tstart = 0, tend = target.length;
    var dstart = 0, dend = donator.length;

    while(dend - dstart > 2){
    	if((dend - dstart) % 2 == 1){ //if donator is oddnumber
    		var dmiddle = parseInt((dend + dstart) / 2);

    		if((tend - tstart) % 2 == 1){
    			var tmiddle = parseInt((tend + tstart) / 2);

    			if(target[tmiddle] > donator[dmiddle]){ // 1/3/*5*/7/9 & 2/*4*/6
    				tstart -= (dmiddle - dstart);
    				dstart = dmiddle;
    			}
    			else{									// 1/3/*5*/7/9 & 4/*6*/8
    				tend += (dend - dmiddle - 1);
    				dend = dmiddle + 1;
    			}
    		}
    		else{
    			var tmiddle = [parseInt((tend + tstart) / 2) - 1, parseInt((tend + tstart) / 2)];

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
    				tend += (dend - dmiddle - 1);
    				dend = dmiddle + 1;
    			}
    		}
    	}
    	else{ //if donator is even number
            var dmiddle = [parseInt((dend + dstart) / 2) - 1, parseInt((dend + dstart) / 2)];
            if((tend - tstart) % 2 == 1){
                var tmiddle = parseInt((tend + tstart) / 2);

                // d t d
                if(donator[dmiddle[0]] <= target[tmiddle] && target[tmiddle] <= donator[dmiddle[1]] )
                    return target[tmiddle];
                // t d d -> remove d's tail
                else if(target[tmiddle] <= donator[dmiddle[0]]){
                    tend += (dend - dmiddle[1] - 1);
                    dend = dmiddle[1] + 1;
                }
                // d d t -> remove d's head
                else {
                    tstart -= (dmiddle[0] - dstart);
                    dstart = dmiddle[0];
                }
            }
            else {
                var tmiddle = [parseInt((tend + tstart) / 2) - 1, parseInt((tend + tstart) / 2)];

                //t d d t
                if(target[tmiddle[0]] <= donator[dmiddle[0]] && donator[dmiddle[1]] <= target[tmiddle[1]])
                    return (donator[dmiddle[0]] + donator[dmiddle[1]]) / 2;
                //d t t d
                else if (donator[dmiddle[0]] <= target[tmiddle[0]] && target[tmiddle[1]] <= donator[dmiddle[1]])
                    return (target[tmiddle[0]] + target[tmiddle[1]]) / 2;
                // t d t d || t t d d
                // 1 *3* *5* 7 & 2 *4* *6* 8
                // everynumber > donator[dmiddle[1]] is useless
                else if (target[tmiddle[1]] <= donator[dmiddle[1]]) {
                    tend += (dend - dmiddle[1] - 1);
                    dend = dmiddle[1] + 1;
                }
                // d t d t || d d t t
                else{
                    tstart -= (dmiddle[0] - dstart);
                    dstart = dmiddle[0];
                }
            }
    	}
    }
    if(dend - dstart == 2){
        if((tend - tstart) % 2 == 1){ //2 odds
            var dmiddle = [dstart, dstart + 1];
            var tmiddle = parseInt((tend + tstart) / 2);
            // d t d
            if(donator[dmiddle[0]] <= target[tmiddle] &&
                target[tmiddle] <= donator[dmiddle[1]])
                return target[tmiddle];
            else if(donator[dmiddle[1]] <= target[tmiddle]){
                // d d t || d tx d t
                if(tmiddle == 0 || target[tmiddle - 1] <= donator[dmiddle[1]])
                    return donator[dmiddle[1]];
                // d d tx t
                else
                    return target[tmiddle - 1];
            }
            else{ 
                // t d d || t d tx d
                if(tmiddle == target.length - 1 || donator[dmiddle[0]] <= target[tmiddle + 1])
                    return donator[dmiddle[0]];
                else
                    return target[tmiddle + 1];
            }

        }
        else {
            var dmiddle = [dstart, dstart + 1];
            var tmiddle = [parseInt((tend + tstart) / 2) - 1, parseInt((tend + tstart) / 2)];

            // d t d t
            if(donator[dmiddle[0]] <= target[tmiddle[0]] 
                && target[tmiddle[0]] <= donator[dmiddle[1]] 
                && donator[dmiddle[1]] <= target[tmiddle[1]]){
                return (target[tmiddle[0]] + donator[dmiddle[1]])/2;
            }
            // t d t d
            else if(target[tmiddle[0]] <= donator[dmiddle[0]]
                && donator[dmiddle[0]] <= target[tmiddle[1]]
                && target[tmiddle[1]] <= donator[dmiddle[1]] ){
                return (donator[dmiddle[0]] + target[tmiddle[1]])/2; 
            }
            // t d d t
            else if(target[tmiddle[0]] <= donator[dmiddle[0]]
                && donator[dmiddle[1]] <= target[tmiddle[1]]){
                return (donator[dmiddle[0]] + donator[dmiddle[1]]) / 2;
            }
            // d t t d
            else if(donator[dmiddle[0]] <= target[tmiddle[0]]
                && target[tmiddle[1]] <= donator[dmiddle[1]]){
                return (target[tmiddle[0]] + target[tmiddle[1]]) / 2;
            }
            else if(target[tmiddle[1]] <= donator[dmiddle[0]]){
                // t t tX d d
                if(tmiddle[1] < target.length - 1 && target[tmiddle[1] + 1] <= donator[0])
                    return (target[tmiddle[1]] + target[tmiddle[1] + 1]) / 2;
                // t t d d
                else
                    return (target[tmiddle[1]] + donator[dmiddle[0]]) / 2;
            }
            else if(donator[dmiddle[1]] < target[tmiddle[0]]){
                // d d tX t t 
                if(tmiddle[0] > 0 && donator[dmiddle[1]] <= target[tmiddle[0] - 1])
                    return (target[tmiddle[0] - 1] + target[tmiddle[0]]) / 2;
                // d d t t
                else
                    return (donator[dmiddle[1]] + target[tmiddle[0]]) / 2;
            }
            
        }
    }
    else if(dend - dstart == 1){
        var dmiddle = dstart;

        if((tend - tstart) % 2 == 1){ //2 odds
            var tmiddle = parseInt((tend + tstart) / 2);

            // d tx t
            if(tmiddle > 0 && donator[dmiddle] <= target[tmiddle - 1])
                return (target[tmiddle - 1] + target[tmiddle]) / 2;
            // t tx d
            else if(tmiddle < target.length - 1 && target[tmiddle + 1] <= donator[dmiddle])
                return (target[tmiddle] + target[tmiddle + 1]) / 2;
            // t d
            else
                return (target[tmiddle] + donator[dmiddle]) / 2;
        }
        else{
            var tmiddle = [parseInt((tend + tstart) / 2) - 1, parseInt((tend + tstart) / 2)];

            if(donator[dmiddle] < target[tmiddle[0]]) // d t t
                return target[tmiddle[0]];
            else if(target[tmiddle[1]] < donator[dmiddle]) // t t d
                return target[tmiddle[1]];
            else
                return donator[dmiddle];     //t d t
        }
    }
    else{	//dend - dstart === 0
        if((tend - tstart) % 2 == 1){ //odd
            var tmiddle = parseInt((tend + tstart) / 2);
            return target[tmiddle];
        }
        else{
            var tmiddle = [parseInt((tend + tstart) / 2) - 1, parseInt((tend + tstart) / 2)];
            return (target[tmiddle[0]] + target[tmiddle[1]]) / 2;
        }
    }
};
/*--------------------------------------------------------------------------------------*/
var calc = function(num1, num2){
	var sortby = function(l, r){return l - r;}
	var sum = num1.concat(num2).sort(sortby);
	//console.log(sum);
	if(sum.length % 2 == 1)
		return sum[parseInt(sum.length/2)];
	else
		return (sum[parseInt(sum.length/2) - 1] + sum[parseInt(sum.length/2)])/2;
};
/*--------------------------------------------------------------------------------------*/
QUnit.test( "Example", function( assert ) {
    var num1   = [4,38,50];
    var num2   = [1,66,95];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result + "[" + num1.toString() +"] [" + num2.toString() + "]");
});



var sortby = function(l, r){return l - r;}
for(let i = 1; i < 10; i++){
    for(let j = 1; j < 10; j++){
        for(let k = 0; k < 5; k ++){
            let r = [];
            let l = [];
            for(let di = 0; di < i; di++)
                r.push(parseInt(Math.random() * 100));
            for(let dj = 0; dj < j; dj++)
                l.push(parseInt(Math.random() * 100));

            r.sort(sortby);
            l.sort(sortby);

            //debugger;
            QUnit.test( "" + i + "." + j + "." + k , function( assert ) {
                var num1   = r;
                var num2   = l;
                console.log("" + i + "." + j + "." + k + ":[" + r.toString() + "] [" + l.toString() + "]")
                var expect = calc(num1, num2);
                var result = findMedianSortedArrays(num1, num2);

                assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result + "[" + r.toString() +"][" + l.toString() + "]");
            });
        }
    }
}

QUnit.test( "Example", function( assert ) {
    var num1   = [45,76];
    var num2   = [5,13,17,37,74];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result + "[" + num1.toString() +"] [" + num2.toString() + "]");
});


QUnit.test( "Example", function( assert ) {
    var num1   = [6,25,32,37,49,74,76,95];
    var num2   = [3,3,68,71,72,88,99];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example", function( assert ) {
    var num1   = [6,25,32,37,49,74,76,95];
    var num2   = [3,3,68,71,72,88,99];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example", function( assert ) {
    var num1   = [27, 29];
    var num2   = [20, 42, 64, 68, 93];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var r   = [2, 4];
    var l   = [1, 3];
    var expect = calc(r, l);
    var result = findMedianSortedArrays(r, l);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result + "[" + r.toString() +  +"][" + l.toString() + "]");
});

QUnit.test( "Example", function( assert ) {
    var num1   = [1, 3];
    var num2   = [2];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1, 3, 5, 7];
    var num2   = [2, 4, 6, 8];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1, 3, 5, 7, 9];
    var num2   = [2, 4, 6, 8];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1, 3, 5, 7, 9, 11];
    var num2   = [2, 4, 6, 8];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1];
    var num2   = [2];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1];
    var num2   = [2, 3, 4, 5, 6];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1, 2];
    var num2   = [2, 3];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});

QUnit.test( "Example2", function( assert ) {
    var num1   = [1, 2];
    var num2   = [1, 2, 3];
    var expect = calc(num1, num2);
    var result = findMedianSortedArrays(num1, num2);

    assert.ok(( expect == result ), "Expect:" + expect + ", Result:" + result);
});