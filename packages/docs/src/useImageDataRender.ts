import type { RefObject } from "react";
import { useLayoutEffect } from "react";
import type { AsyncState } from "./useAsyncFn";

export function useImageDataRenderer(
  ref: RefObject<HTMLCanvasElement>,
  image: AsyncState<ImageData>
) {
  useLayoutEffect(() => {
    if (!ref.current || !image.ok) return;
    const el = ref.current;
    el.width = image.value.width;
    el.height = image.value.height;
    const ctx = el.getContext("2d");
    ctx?.putImageData(image.value, 0, 0);
  }, [image, ref]);
}
