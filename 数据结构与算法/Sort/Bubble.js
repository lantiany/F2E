const testArr = [9, 2, 4, 5, 3, 7, 8, 1, 6];

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
        if (!hasChange) {
            break;
        }
    }

    return arr;
}

console.log(BubbleSort(testArr));
