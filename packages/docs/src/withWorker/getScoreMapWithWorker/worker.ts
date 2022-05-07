import {
  getScoreMap,
  pixelReaderGrayScaleBrightness,
  similarityZNCC,
} from "@berlysia/template-matching";

onmessage = (event) => {
  const { base, temp } = event.data;
  const scoreMap = getScoreMap(
    new ImageData(new Uint8ClampedArray(base.data), base.width, base.height),
    new ImageData(new Uint8ClampedArray(temp.data), temp.width, temp.height),
    similarityZNCC,
    pixelReaderGrayScaleBrightness
  );
  postMessage(
    {
      data: scoreMap.data.buffer,
      width: scoreMap.width,
      height: scoreMap.height,
    },
    [scoreMap.data.buffer]
  );
};
