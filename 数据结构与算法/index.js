var twoSumTarget = function (nums, target) {
    nums = nums.sort((a, b) => a - b);
    let lo = 0, hi = nums.length - 1;
    const result = [];
    while (lo < hi) {
        let left = nums[lo], right = nums[hi];
        let sum = left + right;
        if (sum > target) {
            while (lo < hi && nums[hi] === right) hi--;
        } else if (sum < target){
            while (lo < hi && nums[lo] === left) lo++;
        } else if (sum === target){
            result.push([left, right]);
            while (lo < hi && nums[hi] === right) hi--;
            while (lo < hi && nums[lo] === left) lo++;
        }
    }
    return result;
}

let arr = [1,2,3,4,4,5,6,7];

console.log(twoSumTarget(arr, 8));
