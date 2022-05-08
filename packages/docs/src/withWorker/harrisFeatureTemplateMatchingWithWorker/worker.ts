import {
  cumulativeTemplateMatching,
  narrowingDownTemplateMatching,
  pixelReaderGrayScaleBrightness,
  similarityZNCC,
  sliceByFeatures,
} from "@berlysia/template-matching";

onmessage = (event) => {
  const { base, temp, features } = event.data;
  const tempImage = new ImageData(
    new Uint8ClampedArray(temp.data),
    temp.width,
    temp.height
  );
  const pos = narrowingDownTemplateMatching(
    new ImageData(new Uint8ClampedArray(base.data), base.width, base.height),
    tempImage,
    similarityZNCC,
    pixelReaderGrayScaleBrightness,
    0.7,
    (x) => sliceByFeatures(x, features)
  );
  postMessage(pos);
};
