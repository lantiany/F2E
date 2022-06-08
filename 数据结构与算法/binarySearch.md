```typescript
// 基础二分搜索
var binarySearch = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target){
      left = mid + 1;
    } else if (nums[mid] > target){
      right = mid - 1;
    } else if (nums[mid] === target){
      return mid;
    }
  }
  return -1;
}

// 搜索左边界
var binaryLeftBound = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right){
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target){
      left = mid + 1;
    } else if (nums[mid] > target){
      right = mid - 1;
    } else if (nums[mid] === target){
      right = mid - 1;
    }
  }

  if (left >= nums.length - 1 || nums[left] !== target){
    return -1
  }
  return left
}

// 搜索右边界
var binaryRightBound = function (nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right){
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] < target){
      left = mid + 1;
    } else if (nums[mid] > target){
      right = mid - 1;
    } else if (nums[mid] === target){
      left = mid + 1;
    }
  }

  if (right < 0 || nums[right] !== target){
    return -1
  }
  return right
}
```


### 875、爱吃香蕉的珂珂

[爱吃香蕉的珂珂](https://leetcode.cn/problems/koko-eating-bananas/submissions/)

```typescript
var minEatingSpeed = function (piles, h) {
    let maxVal = 1;
    for (let pile of piles) {
        if (pile > maxVal) maxVal = pile;
    }
    let left = 1, right = maxVal;
    while (left < right){
        let mid = Math.floor(left + (right - left) / 2);
        if (calcSum(piles, mid) > h){
            left = mid + 1;
        }else {
            right = mid;
        }
    }
    return left;

    function calcSum(piles, speed){
        let sum = 0;
        for (let pile of piles){
            sum += Math.ceil(pile / speed);
        }
        return sum;
    }
};

console.log(minEatingSpeed([30,11,23,4,20], 6))
```
