import {
  slicedTemplateMatching,
  pixelReaderGrayScaleBrightness,
  similarityZNCC,
} from "@berlysia/template-matching";

onmessage = (event) => {
  const { base, temp } = event.data;
  const pos = slicedTemplateMatching(
    new ImageData(new Uint8ClampedArray(base.data), base.width, base.height),
    new ImageData(new Uint8ClampedArray(temp.data), temp.width, temp.height),
    similarityZNCC,
    pixelReaderGrayScaleBrightness,
    0.95
  );
  postMessage(pos);
};
