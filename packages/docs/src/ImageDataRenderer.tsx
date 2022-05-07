import type { ComponentProps } from "react";
import {
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";

export const ImageDataRenderer = forwardRef<
  HTMLCanvasElement,
  Exclude<ComponentProps<"canvas">, "src"> & { src: ImageData }
>(function ImageDataRenderer({ src, ...rest }, forwardedRef) {
  const ref = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);

  useLayoutEffect(() => {
    const el = ref.current!;
    el.width = src.width;
    el.height = src.height;
    el.getContext("2d")!.putImageData(src, 0, 0);
  }, [src]);

  return <canvas ref={ref} {...rest} />;
});
