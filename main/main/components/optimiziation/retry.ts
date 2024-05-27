export default function retry(fn: () => Promise<any>, retriesLeft: number = 5, interval: number = 1000): Promise<any> {
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch((error: any) => {
          setTimeout(() => {
            if (retriesLeft === 1) {
              // reject('maximum retries exceeded');
              reject(error);
              return;
            }
  
            // Passing on "reject" is the important part
            retry(fn, retriesLeft - 1, interval).then(resolve, reject);
          }, interval);
        });
    });
  }

  // const handleSubmit = lazy(() => retry(() => import("./HandleSign")));