export async function waitWorker<T>(worker: Worker) {
  return new Promise<T>((resolve, reject) => {
    const resolver = (e: MessageEvent<T>) => {
      resolve(e.data);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- どうにもならない
      removeHandler();
    };
    const rejector = (e: unknown) => {
      reject(e);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define -- どうにもならない
      removeHandler();
    };
    const removeHandler = () => {
      worker.removeEventListener("message", resolver);
      worker.removeEventListener("error", rejector);
      worker.removeEventListener("messageerror", rejector);
    };
    worker.addEventListener("message", resolver, { once: true });
    worker.addEventListener("error", rejector, { once: true });
    worker.addEventListener("messageerror", rejector, { once: true });
  });
}
