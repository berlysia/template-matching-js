import { waitWorker } from "../../waitWorker";
import Worker from "./worker?worker";

export async function getCoOccurrenceMap(
  tempImage: ImageData
): Promise<ImageData> {
  const worker = new Worker();

  const tempCopy = new Uint8ClampedArray(tempImage.data);

  const p = waitWorker<ReturnType<typeof getCoOccurrenceMap>>(worker);
  worker.postMessage(
    {
      temp: {
        data: tempCopy.buffer,
        width: tempImage.width,
        height: tempImage.height,
      },
    },
    [tempCopy.buffer]
  );

  const seed = await p;
  return new ImageData(
    new Uint8ClampedArray(seed.data),
    seed.width,
    seed.height
  );
}
