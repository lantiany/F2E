function deepClone(target, cloneMap = new WeakMap()) {
    if (target === null || typeof target !== 'object') {
        return target
    }
    const isArray = Array.isArray(target)
    let result = isArray ? [] : {}

    if (cloneMap.get(target)) {
        return cloneMap.get(target)
    }
    cloneMap.set(target, result)

    // 改成循环，循环需要兼容数组和对象的遍历
    const keys = isArray ? undefined : Object.keys(target)

    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value
        }
        result[key] = deepClone(target[key], cloneMap)
    })
    return result
}

function forEach(array, iterator) {
    let index = -1, length = array.length;
    while (++index < length) {
        iterator(array[index], index)
    }
}
