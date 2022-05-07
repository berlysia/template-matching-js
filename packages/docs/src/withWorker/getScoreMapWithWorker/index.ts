import { waitWorker } from "../../waitWorker";
import Worker from "./worker?worker";

export async function getScoreMap(
  baseImage: ImageData,
  tempImage: ImageData
): Promise<ImageData> {
  const worker = new Worker();

  const baseCopy = new Uint8ClampedArray(baseImage.data);
  const tempCopy = new Uint8ClampedArray(tempImage.data);

  const p = waitWorker<ReturnType<typeof getScoreMap>>(worker);
  worker.postMessage(
    {
      base: {
        data: baseCopy.buffer,
        width: baseImage.width,
        height: baseImage.height,
      },
      temp: {
        data: tempCopy.buffer,
        width: tempImage.width,
        height: tempImage.height,
      },
    },
    [baseCopy.buffer, tempCopy.buffer]
  );

  const seed = await p;
  return new ImageData(
    new Uint8ClampedArray(seed.data),
    seed.width,
    seed.height
  );
}
