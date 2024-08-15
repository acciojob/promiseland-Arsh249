class CustomPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.onFinallyCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state   
 = 'fulfilled';
        this.value = value;
        this.onFulfilledCallbacks.forEach(callback => callback(value));
        this.onFinallyCallbacks.forEach(callback   
 => callback());
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(callback   
 => callback(reason));
        this.onFinallyCallbacks.forEach(callback => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected)   
 {
    return new CustomPromise((resolve, reject) => {
      if (this.state   
 === 'fulfilled') {
        setTimeout(() => {
          try {
            const result = onFulfilled(this.value);
            if (result instanceof CustomPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch   
 (error) {
            reject(error);
          }
        });
      } else if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            const result = onRejected(this.reason);
            if (result instanceof CustomPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch   
 (error) {
            reject(error);
          }
        });
      } else {
        this.onFulfilledCallbacks.push((value) => {
          try {
            const result = onFulfilled(value);
            if (result instanceof CustomPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          try {
            const result = onRejected(reason);
            if (result instanceof CustomPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    this.onFinallyCallbacks.push(onFinally);
    return this;
  }
}

window.CustomPromise = CustomPromise;