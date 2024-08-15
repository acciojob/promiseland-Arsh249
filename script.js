class CustomPromise {
    constructor(executor) {
        this.state = 'pending'; // initial state
        this.value = undefined; // resolved value
        this.reason = undefined; // rejection reason
        this.handlers = []; // to store then, catch, and finally callbacks

        try {
            executor(this.resolve.bind(this), this.reject.bind(this));
        } catch (err) {
            this.reject(err);
        }
    }

    resolve(value) {
        if (this.state === 'pending') {
            this.state = 'fulfilled';
            this.value = value;
            this.executeHandlers();
        }
    }

    reject(reason) {
        if (this.state === 'pending') {
            this.state = 'rejected';
            this.reason = reason;
            this.executeHandlers();
        }
    }

    then(onFulfilled, onRejected) {
        return new CustomPromise((resolve, reject) => {
            this.handlers.push({
                onFulfilled: value => {
                    if (onFulfilled) {
                        try {
                            resolve(onFulfilled(value));
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        resolve(value);
                    }
                },
                onRejected: reason => {
                    if (onRejected) {
                        try {
                            resolve(onRejected(reason));
                        } catch (err) {
                            reject(err);
                        }
                    } else {
                        reject(reason);
                    }
                },
                onFinally: null
            });

            if (this.state !== 'pending') {
                this.executeHandlers();
            }
        });
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        return new CustomPromise((resolve, reject) => {
            this.handlers.push({
                onFulfilled: value => {
                    if (onFinally) {
                        onFinally();
                    }
                    resolve(value);
                },
                onRejected: reason => {
                    if (onFinally) {
                        onFinally();
                    }
                    reject(reason);
                },
                onFinally
            });

            if (this.state !== 'pending') {
                this.executeHandlers();
            }
        });
    }

    executeHandlers() {
        if (this.state === 'fulfilled') {
            this.handlers.forEach(handler => {
                if (handler.onFulfilled) {
                    handler.onFulfilled(this.value);
                }
                if (handler.onFinally) {
                    handler.onFinally();
                }
            });
        }

        if (this.state === 'rejected') {
            this.handlers.forEach(handler => {
                if (handler.onRejected) {
                    handler.onRejected(this.reason);
                }
                if (handler.onFinally) {
                    handler.onFinally();
                }
            });
        }

        this.handlers = []; // Clear handlers once they have been executed
    }
}

// Example usage:

const promise = new CustomPromise((resolve, reject) => {
    setTimeout(() => resolve('Task completed successfully!'), 1000);
});

promise
    .then(value => {
        console.log(value);
        return 'Next task';
    })
    .then(value => {
        console.log(value);
    })
    .catch(reason => {
        console.error('Error:', reason);
    })
    .finally(() => {
        console.log('All tasks finished.');
    });

window.CustomPromise = CustomPromise;