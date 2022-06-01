## 二叉树相关题目

### 104. 二叉树的最大深度

[二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/submissions/)

思路：理解二叉树的结构，二叉树有一个根结点，根结点可以有左右两个子节点。
而如果横向看二叉树，那就是一层一层的。

```typescript
//
//     3
//   / \
//  9  20
//    /  \
//   15   7
//
```

从第一层开始，在遍历每一层的时候，先记录当前这一层的节点个数`size` ，
将这一层的每一个节点放入队列中，每遍历一个节点`size - 1` , 当 size 为 0 的时候，
这一层遍历完毕，深度 depth + 1。开启下一层的遍历，size 重置为下一层的节点个数。

> ps: 理解了这一点, 二叉树（甚至N叉树）的层序遍历相关题目感觉就有眉目了。
```typescript
var maxDepth = function(root) {
    if(root == null) return 0;
    let depth = 0, queue = [root];
    while(queue.length > 0){
        let size = queue.length;
        while(size > 0){
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
