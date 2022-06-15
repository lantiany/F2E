### 206、反转链表

[反转链表](https://leetcode.cn/problems/reverse-linked-list/)


迭代解法思路：
```text
next
prev   curr   
null     1  ->  2  ->  3  ->  4  ->  5

prev     curr   next
null  <-   1  ->  2  ->  3  ->  4  ->  5

         prev   curr   next
null  <-   1  ->  2  ->  3  ->  4  ->  5
         next = curr.next;  指针后移
         curr.next = prev;  反转
         prev = curr;       指针后移
         curr = next;       指针后移
         
         ......
                                             next
                                    prev     curr
null  <-  1  <-  2  <-  3  <-  4  <-  5      null
```

```typescript
var reverseList = function (head) {
  if (head == null) return null;
  let prev = null, next = null, curr = head;
  while (curr) {
    next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
```


递归解法：

```typescript
var reverseList = function (head) {
  if (head == null || head.next == null) return head;
  
  let last = reverseList(head.next);
  
  head.next.next = head
  head.next = null;
  
  return last;
}
```
