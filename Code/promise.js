class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(executor) {
        this.PromiseState = MyPromise.PENDING;
        this.PromiseResult = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (err) {
            this.reject(err);
        }
    }

    resolve(result) {
        if (this.PromiseState === MyPromise.PENDING) {
            setTimeout(() => {
                this.PromiseState = MyPromise.FULFILLED;
                this.PromiseResult = result;
                this.onFulfilledCallbacks.forEach(cb => cb(result));
            })
        }
    }

    reject(reason) {
        if (this.PromiseState === MyPromise.PENDING) {
            setTimeout(() => {
                this.PromiseState = MyPromise.REJECTED;
                this.PromiseResult = reason;
                this.onRejectedCallbacks.forEach(cb => cb(reason));
            })
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => {
            throw reason;
        };
        const promise2 = new MyPromise((resolve, reject) => {
            if (this.PromiseState === MyPromise.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
                this.onRejectedCallbacks.push(() => {
                    try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            } else if (this.PromiseState === MyPromise.FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            } else if (this.PromiseState === MyPromise.REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.PromiseResult);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })
        return promise2;
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (x === promise2) {
        return reject(new TypeError('Chaining cycle detected for MyPromise'));
    }

    if (x instanceof MyPromise) {
        if (x.PromiseState === MyPromise.PENDING) {
            x.then((y) => {
                resolvePromise(promise2, y, resolve, reject);
            }, reject);
        } else if (x.PromiseState === MyPromise.FULFILLED) {
            resolve(x.PromiseResult)
        } else if (x.PromiseState === MyPromise.REJECTED) {
            reject(x.PromiseResult)
        }
    } else if (x !== null && ((typeof x === 'object') || (typeof x === 'function'))) {
        let then = x.then;
        if (typeof then === 'function') {
            let called = false;
            try {
                then.call(x, y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, r => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, r, resolve, reject);
                })
            } catch (e) {
                if (called) return;
                called = true;
                reject(e);
            }
        } else {
            resolve(x);
        }
    } else {
        return resolve(x);
    }
}

let p = new MyPromise((resolve, reject) => {
    console.log(1);
    setTimeout(() => {
        resolve(2)
    }, 1000)
})

p.then(val => {
    console.log(val);
    return val + 1;
}).then(val => {
    throw new Error(val + 1);
}).then(val => {
    console.log(val)
}, err => {
    console.log("err: ", err.toString())
})
