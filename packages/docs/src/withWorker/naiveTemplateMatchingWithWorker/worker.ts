import {
  naiveTemplateMatching,
  pixelReaderGrayScaleBrightness,
  similarityZNCC,
} from "@berlysia/template-matching";

onmessage = (event) => {
  const { base, temp } = event.data;
  const pos = naiveTemplateMatching(
    new ImageData(new Uint8ClampedArray(base.data), base.width, base.height),
    new ImageData(new Uint8ClampedArray(temp.data), temp.width, temp.height),
    similarityZNCC,
    pixelReaderGrayScaleBrightness
  );
  postMessage(pos);
};
