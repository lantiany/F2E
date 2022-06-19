### 93、[复原IP地址 Hard](https://leetcode.cn/problems/restore-ip-addresses/submissions/)

```typescript
var restoreIpAddresses = function (s) {
  const result = [];

  dfs(s, [], s.length, 0);

  // path: []   存储当前 ip 地址 ['10', '1', '23', '12']
  // remainLen  字符串剩余长度
  // start      标记本次从哪儿开始
  function dfs(s, path, remainLen, start) {
    // 当前 path 里面有四个数字，字符串剩余长度为 0， 说明是合法的
    if (path.length === 4 && remainLen === 0) {
      result.push(path.join('.'));
      return;
    }

    // 如果 剩余字符串长度小于剩余的 ip 位数  （不够用，前面用多了）
    // 如果 剩余字符串长度大于剩余的 ip 位数 * 3  （剩余多了，前面位数用的少）
    // 这两种情况都不能继续下去
    if (remainLen < (4 - path.length) || remainLen > (4 - path.length) * 3) {
      return;
    }

    // 每一次尝试截取 1 - 3 位
    for (let i = 1; i <= 3; i++) {
      let num = parseInt(s.substring(start, start + i));
      // 数字需要在 [0, 255] 区间中, '01, 001' 这种情况⬇️要特别考虑（过滤掉） 
      if ((num >= 0 && num <= 255) || (num === 0 && i === 1)) {
        path.push(s.substring(start, start + i));
        dfs(s, path, remainLen - i, start + i)
        path.pop();
      }

      // 出现了 0， 后面第二次第三次一定是 '0x，00x' 这种就不需要继续了
      if (i === 1 && num === 0) {
        break;
      }
    }
  }

  return result;
};
```

### 22、[括号生成](https://leetcode.cn/problems/generate-parentheses/submissions/)

```typescript
var generateParenthesis = function (n) {
  const result = [];

  dfs('', 0, 0);

  return result;

  function dfs(path, leftCount, rightCount) {
    if (path.length === n * 2) {
      result.push(path);
      return;
    }
    
    // 左括号个数小于 n 的时候就继续
    if (leftCount < n) {
      dfs(path + '(', leftCount + 1, rightCount);
    }

    // 必须先有左括号，才能加 右括号
    // 所以右括号个数小于左括号的时候就可以加 右括号
    if (rightCount < leftCount) {
      dfs(path + ')', leftCount, rightCount + 1);
    }
  }
};
```
