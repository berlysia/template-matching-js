export async function loadImageAsImageData(
  src: string,
  opts?: { x: number; y: number; w: number; h: number }
): Promise<ImageData> {
  const image = new Image();
  const p = new Promise((resolve) =>
    image.addEventListener("load", resolve, { once: true })
  );
  image.src = src;
  await p;
  const rect = opts ?? { x: 0, y: 0, w: image.width, h: image.height };
  const offscreen = new OffscreenCanvas(image.width, image.height);
  const ctx = offscreen.getContext("2d")!;
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(rect.x, rect.y, rect.w, rect.h);
}
