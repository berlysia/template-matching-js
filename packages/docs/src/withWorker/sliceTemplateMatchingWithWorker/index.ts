import type { Candidate } from "@berlysia/template-matching";
import { waitWorker } from "../../waitWorker";
import Worker from "./worker?worker";

export async function sliceTemplateMatching(
  baseImage: ImageData,
  tempImage: ImageData
): Promise<Candidate[]> {
  const worker = new Worker();

  const baseCopy = new Uint8ClampedArray(baseImage.data);
  const tempCopy = new Uint8ClampedArray(tempImage.data);

  const p = waitWorker<ReturnType<typeof sliceTemplateMatching>>(worker);
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

  return await p;
}
