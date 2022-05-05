# 排序算法


## 相关概念

### 原地排序
不需要额外的存储空间，对原数组进行操作。

### 稳定性

数组中相同元素的排序顺序不会变化。


## 冒泡排序

```javascript
function BubbleSort(arr) {
    const len = arr.length;

    if (len < 2) {
        return arr;
    }

    for (let i = 0; i < len; i++) {
        let hasChange = false;
        for (let j = 0; j < len - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                hasChange = true;
            }
        }
        // 如果本轮没有元素发生交换，则排序已完成，退出循环
        if (!hasChange) {
            break;
        }
    }

    return arr;
}
```
