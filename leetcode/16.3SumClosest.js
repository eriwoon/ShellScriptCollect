var threeSumClosest = function(nums, target) {
    nums.sort(function(l,r){return l-r;});
    
    var abs = function(val){return (val < 0 ? 0 - val : val);};
    var minimal;
    //debugger;
    for(var first = 0; first < nums.length - 2; first ++){
        for(var second = first + 1; second < nums.length - 1; second ++){
            for(var start = second + 1, end = nums.length - 1; start <= end;){
                var testpoint = (start + end) >> 1;
                var sum       = nums[first] + nums[second] + nums[testpoint] - target;
                
                if(minimal === undefined || abs(sum) < abs(minimal))
                    minimal = sum;

                if(sum > 0){
                    if(end == testpoint)break;
                    end = testpoint;
                }
                else if(sum < 0){
                    start = testpoint + 1;
                }
                else
                    return target;
            }
        }
    }
    if(minimal !== undefined)
        return target + minimal;
    else
        return undefined;
};



QUnit.test( "-1,2,1,4", function( assert ) {
    var nums = [-1, 2, 1, -4];
    var target = 1;
    var result = threeSumClosest(nums, target);
    console.log(result);
    console.log(nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
    assert.ok( 2 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "-11, -7, -3, 4, 5, 6, 9, 11", function( assert ) {
    var nums = [-11, -7, -3, 4, 5, 6, 9, 11];
    var target = 0;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 0 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "-55,-24,-18,-11,-7,-3,4,5,6,9,11,23,33", function( assert ) {
    var nums = [-55,-24,-18,-11,-7,-3,4,5,6,9,11,23,33];
    var target = 0;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 0 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "-1, 2, 1, -4", function( assert ) {
    var nums = [-1, 2, 1, -4];
    var target = 1;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 2 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "0,2,1,-3", function( assert ) {
    var nums = [0,2,1,-3];
    var target = 1;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 0 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());//0
});

QUnit.test( "1,2,4,8,16,32,64,128", function( assert ) {
    var nums = [1,2,4,8,16,32,64,128];
    var target = 82;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 82 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "0,0,0", function( assert ) {
    var nums = [0,0,0];
    var target = 8;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 0 == result, nums.toString()  + " target:" + target.toString() + " result:" + result.toString());
});

QUnit.test( "0,0", function( assert ) {
    var nums = [0,0];
    var target = 8;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( undefined === result, nums.toString()  + " target:" + target.toString() + " result:undefined");
});