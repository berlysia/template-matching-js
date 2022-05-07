import {
  getCoOccurrenceMap,
  pixelReaderGrayScaleBrightness,
} from "@berlysia/template-matching";

onmessage = (event) => {
  const { temp } = event.data;
  const scoreMap = getCoOccurrenceMap(
    new ImageData(new Uint8ClampedArray(temp.data), temp.width, temp.height),
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
