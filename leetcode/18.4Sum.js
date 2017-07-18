var fourSum = function(nums, target) {
	var sortby = function(l, r){return l-r;};
	var isExist  = function(result, newlist){
		for(let i = 0; i < result.length; i++){
			let cur = result[i];
			if(cur[0] == newlist[0] && cur[1] == newlist[1] && cur[2] == newlist[2] && cur[3] == newlist[3])
				return true;
		}
		return false;
	};

	var combine = [];
	var sumlist = [];
	var result  = [];
	//2 combine 
	for(let i = 0; i < nums.length - 1; i ++){
		for(let j = i + 1; j<nums.length; j ++){
			let sum = nums[i] + nums[j];

			if(sum in combine)
				combine[sum].push([i,j]);
			else{
				sumlist.push(sum);
				combine[sum] = [[i,j]];
			}
		}
	}
	sumlist.sort(sortby);
	debugger;
	//combile again
	for(let i = 0; i < sumlist.length; i ++){
		for(let start = i, end = sumlist.length - 1; start <= end;){
			let testpoint = (start + end) >> 1;
			let sum = sumlist[i] + sumlist[testpoint];
			if(sum > target) {
                if(end == testpoint)break;
                end = testpoint;
            }
            else if(sum < target){
                start = testpoint + 1;
            }
            else{
            	let listi = combine[sumlist[i]], listj = combine[sumlist[testpoint]];
				for(let si = 0; si < listi.length; si++){
					for(let sj = 0; sj < listj.length; sj ++){
						//every number can be only used once;
						let newnumlist = [listi[si][0], listi[si][1], listj[sj][0], listj[sj][1]];
						newnumlist.sort(sortby);
						if(newnumlist[0] == newnumlist[1] ||
							newnumlist[1] == newnumlist[2] ||
							newnumlist[2] == newnumlist[3])
							continue;
						//the combination has to be unique
						let newlist = [nums[listi[si][0]], nums[listi[si][1]], nums[listj[sj][0]], nums[listj[sj][1]]];
						newlist.sort(sortby);
						if( ! isExist(result, newlist)){
							result.push(newlist);
						}
					}
				}
				break;
            }
		}
	}
	return result;
};



var validate = function(expect, result){
	if(expect.length != result.length) return false;

	for(let i = 0; i < expect.length; i ++){
		expect[i].sort(function(l,r){return l-r;});

		let matched = false;
		for(let j = 0; j < result.length; j++){
			result.sort(function(l,r){return l-r;});
			let all_matched = true;
			for(let k = 0; k < 4 ; k++){
				if(expect[i][k] != result[j][k]){
					all_matched = false;
					break;
				}
			}
			if(all_matched == true){
				matched = true;
				break;
			}
		}
		if(matched == false)
			return false;
	}
	return true;
};

QUnit.test( "1, -2, -5, -4, -3, 3, 3, 5", function( assert ) {
    var nums = [1, -2, -5, -4, -3, 3, 3, 5];
    var target = -11;
    var expect = [[-5,-4,-3,1]];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

QUnit.test( "1, 0, -1, 0, -2, 2", function( assert ) {
    var nums = [1, 0, -1, 0, -2, 2];
    var target = 0;
    var expect = [[-1,  0, 0, 1], [-2, -1, 1, 2], [-2,  0, 0, 2]];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

QUnit.test( "0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0", function( assert ) {
    var nums = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var target = 0;
    var expect = [[0,  0, 0, 0]];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

QUnit.test( "1000, 2000, 3000, 4000, 1,2,3,4", function( assert ) {
    var nums = [1000, 2000, 3000, 4000, 1,2,3,4];
    var target = 3003;
    var expect = [[1,  2, 1000, 2000]];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

QUnit.test( "1000, 2000, 3000, 4000, 1,2,3,4", function( assert ) {
    var nums = [1000, 2000, 3000, 4000, 1,2,3,4];
    var target = 5005;
    var expect = [[1,  4, 1000, 4000], [2,  3, 2000, 3000], [1,  4, 2000, 3000], [2,  3, 1000, 4000]];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

QUnit.test( "95 with 0 result", function( assert ) {
    var nums = [-493,-487,-480,-464,-456,-449,-445,-439,-437,-427,-415,-403,-400,-398,-372,-349,-347,-332,-330,-324,-287,-282,-273,-254,-249,-243,-220,-219,-217,-217,-214,-199,-198,-170,-153,-150,-143,-136,-113,-93,-91,-88,-87,-78,-58,-58,-55,-51,-49,-42,-38,-36,-26,0,13,28,54,61,85,90,90,111,118,136,138,167,170,172,195,198,205,209,241,263,290,302,324,328,347,359,373,390,406,417,435,439,443,446,464,465,468,484,486,492,493];
    var target = -4437;
    var expect = [];
    var result = fourSum(nums, target);

    assert.ok( true == validate(expect, result), nums.toString()  + " target:" + target.toString() + " expect:" + expect.toString() + " result:" + result.toString());
});

