import { useEffect, useState } from "react";

export type AsyncState<T> =
  | {
      ok: false;
      err: false;
    }
  | {
      ok: true;
      err: false;
      value: T;
    }
  | {
      ok: false;
      err: true;
      value: unknown;
    };

export function useAsyncFn<T>(fn: () => Promise<T>): AsyncState<T> {
  const [asyncState, setAsyncState] = useState<AsyncState<T>>({
    ok: false,
    err: false,
  });

  useEffect(() => {
    setAsyncState({ ok: false, err: false });
    let current = true;
    fn().then(
      (v) => current && setAsyncState({ ok: true, err: false, value: v }),
      (e) => current && setAsyncState({ ok: false, err: true, value: e })
    );
    return () => {
      current = false;
    };
  }, [fn]);

  return asyncState;
}
