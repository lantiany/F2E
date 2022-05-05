const testArr = [7, 8, 9, 10, 1, 2, 3, 4, 5, 6,];


function Insert(arr) {
    const len = arr.length;

    if (len < 2) {
        return arr;
    }

    let prevIndex;
    let current;

    for (let i = 1; i < len; i++) {
        prevIndex = i - 1;
        current = arr[i];

        while (prevIndex >= 0 && arr[prevIndex] > current) {
            arr[prevIndex + 1] = arr[prevIndex];
            prevIndex--;
        }

        if (prevIndex + 1 !== i) {
            arr[prevIndex + 1] = current;
        }
    }

    return arr;
}

console.log(Insert(testArr));
