var threeSumClosest = function(nums, target) {
    nums.sort(function(l,r){return l-r;});
    
    var abs = function(val){return val < 0 ? 0 - val : val;};
    var minimal;
    //debugger;
    for(var first = 0; first < nums.length - 2; first ++){
        for(var second = first + 1; second < nums.length - 1; second ++){
            for(var start = second + 1, end = nums.length - 1; ;){
                var testpoint = (start + end) >> 1;
                var sum       = nums[first] + nums[second] + nums[testpoint] - target;
                
                if(minimal === undefined || abs(sum) < minimal)
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



QUnit.test( "-1,2,1,4->1", function( assert ) {
    var nums = [-1, 2, 1, -4];
    var target = 1;
    var result = threeSumClosest(nums, target);
    console.log(result);
  assert.ok( 2 == result, "Test in the case.");
});