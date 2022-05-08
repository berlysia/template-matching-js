import type { HarrisFeature, Candidate } from "@berlysia/template-matching";
import { waitWorker } from "../../waitWorker";
import Worker from "./worker?worker";

export async function harrisFeatureTemplateMatching(
  baseImage: ImageData,
  tempImage: ImageData,
  features: HarrisFeature[]
): Promise<Candidate[]> {
  if (!features || features.length === 0)
    throw new Error("there is no feature");
  const worker = new Worker();

  const baseCopy = new Uint8ClampedArray(baseImage.data);
  const tempCopy = new Uint8ClampedArray(tempImage.data);

  const p =
    waitWorker<ReturnType<typeof harrisFeatureTemplateMatching>>(worker);
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
      features,
    },
    [baseCopy.buffer, tempCopy.buffer]
  );

  return await p;
}
