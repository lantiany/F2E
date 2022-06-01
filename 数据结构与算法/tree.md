## 二叉树相关题目

### 104. 二叉树的最大深度

[二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/submissions/)

思路：理解二叉树的结构，二叉树有一个根结点，根结点可以有左右两个子节点。 而如果横向看二叉树，那就是一层一层的。

```typescript
//
//    3
//   / \
//  9  20
//    /  \
//   15   7
//
```

从第一层开始，在遍历每一层的时候，先记录当前这一层的节点个数`size` ， 将这一层的每一个节点放入队列中，每遍历一个节点`size - 1` , 当 size 为 0 的时候， 这一层遍历完毕，深度 depth +
1。开启下一层的遍历，size 重置为下一层的节点个数。

> ps: 理解了这一点, 二叉树（甚至N叉树）的层序遍历相关题目感觉就有眉目了。

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, queue = [root];
  while (queue.length > 0) {
    let size = queue.length;
    while (size > 0) {
      const node = queue.shift();
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
      size--;
    }
    depth++;
  }
  return depth;
};
```

写完了循环，再尝试尝试递归。

递归三要素：

1、函数主功能。 2、参数、返回值。 3、递归结束条件。

思路：二叉树的基本结构（或者说是最小单位）是：根结点，左右子节点（可能没有）。对于每一个节点，看是否存在子节点，存在子节点则深度+1，计算每个单元的深度，取更大的那个值，一直做下去，直到到达每一个分叉的终点，就得到最大的深度。

ps: 可以这样理解，但是执行过程并不是这样的。

```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let l = maxDepth(root.left);
  let r = maxDepth(root.right);
  return Math.max(l, r) + 1;
}
```

### 559. N叉数的最大深度

[N叉数的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/)

思路同二叉树的深度。

循环
```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, queue = [root];
  while (queue.length > 0) {
    let size = queue.length;
    while (size > 0) {
      const node = queue.shift();
      node.children && queue.push(...node.children);
      size--;
    }
    depth++;
  }
  return depth;
};
```

递归
```typescript
var maxDepth = function (root) {
  if (root == null) return 0;
  let depth = 0, children = root.children;
  
  for(let child of children){
    let childDepth = maxDepth(child);
    depth = Math.max(depth, childDepth);
  }
  return depth + 1;
}
```

