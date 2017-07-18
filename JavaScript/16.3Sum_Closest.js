/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */

 //这个算法在逻辑上是不通的，我可能需要找其他的算法了。
var threeSumClosest = function(nums, target) {
    var abs = function(val){return (val > 0 ? val: 0 - val);};
    nums.sort(function(l,r){return l-r;});
    
    var minimal;

    for(let i = 0; i<nums.length-2 ; i++){

    	let start = i + 1;
    	let end = nums.length - 1;

    	let curMinimal;
    	while(start != end){
    		let sum = nums[i] + nums[start] + nums[end];

    		if(curMinimal === undefined){
    			curMinimal = target - sum;
    		}
    		
    		let curValue = target - sum;
    		
    		if(abs(curValue) <= abs(curMinimal)){
	   			curMinimal = curValue;
	   			if(curValue > 0)
	   				start ++;
	  			else if(curValue < 0)
	    			end--;
	    		else
	    			return target;
    		}
    		else
    			break;
    		
    		if(minimal === undefined)
    			minimal = curMinimal;
    		else if(abs(curMinimal) < abs(minimal)) 
	    		minimal = curMinimal; 
     	}
    }
    return target - minimal;
};
debugger
console.log("Hello World!");

nums = [-11, -7, -3, 4, 5, 6, 9, 11];
target = 0;
console.log(threeSumClosest(nums,target));

nums = [-55,-24,-18,-11,-7,-3,4,5,6,9,11,23,33];
target = 0;//0
console.log(threeSumClosest(nums,target));

nums = [-1, 2, 1, -4];
target = 1;//2
console.log(threeSumClosest(nums,target));
nums = [0, 0, 0];
target = 1;//0

console.log(threeSumClosest(nums,target));

nums = [0,2,1,-3];
target = 1;//0
console.log(threeSumClosest(nums,target));

nums = [1,2,4,8,16,32,64,128];
target = 82;//82
console.log(threeSumClosest(nums,target));

