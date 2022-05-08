import type {
  HarrisFeature,
  PartialImageData,
} from "@berlysia/template-matching";
import {
  average as peekAverage,
  maxOneCandidateSelector,
  sliceByFeatures,
  getSampleMap,
  harrisCornerDetection,
} from "@berlysia/template-matching";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadImageAsImageData } from "./loadImageAsImageData";
import { useAsyncFn } from "./useAsyncFn";
import { naiveTemplateMatching as naiveTemplateMatchingWithWorker } from "./withWorker/naiveTemplateMatchingWithWorker";
import { sliceTemplateMatching as sliceTemplateMatchingWithWorker } from "./withWorker/sliceTemplateMatchingWithWorker";
import { harrisFeatureTemplateMatching as harrisFeatureTemplateMatchingWithWorker } from "./withWorker/harrisFeatureTemplateMatchingWithWorker";
import { getScoreMap as getScoreMapWithWorker } from "./withWorker/getScoreMapWithWorker";
import { getCoOccurrenceMap } from "./withWorker/getCoOccurenceMapWithWorker";
import { useImageDataRenderer } from "./useImageDataRender";
import { ImageDataRenderer } from "./ImageDataRenderer";

function cornerDetection(image: ImageData, radius: number) {
  if (image.width < radius * 2 || image.height < radius * 2) return [];
  let threshold = 1e6;
  let result = harrisCornerDetection(image, threshold, radius);
  while (result.length > 15 && threshold < 1e10) {
    threshold *= 10;
    result = harrisCornerDetection(image, threshold, radius);
  }
  while (result.length < 5 && threshold >= 1e4) {
    threshold /= 10;
    result = harrisCornerDetection(image, threshold, radius);
  }
  return result;
}

type Position = {
  x: number;
  y: number;
};
const RECT_KEYS = ["x", "y", "w", "h"] as const;

const NAMES = [
  "Aerial",
  "Airplane",
  "Balloon",
  "Earth",
  "Girl",
  "Mandrill",
  "Parrots",
  "Pepper",
  "Sailboat",
  "couple",
  "milkdrop",
];

function readLocation() {
  const params = new URLSearchParams(location.search);
  return Object.fromEntries(
    ["src", "x", "y", "w", "h"].map((k) =>
      params.get(k)
        ? [k, k === "src" ? params.get(k) : parseInt(params.get(k)!, 10)]
        : []
    )
  );
}

function fisherYatesShuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); //random index
    [arr[i], arr[j]] = [arr[j]!, arr[i]!]; // swap
  }
}

function App() {
  const [imageInfo, setImageInfo] = useState(() => ({
    x: Math.floor(Math.random() * 180),
    y: Math.floor(Math.random() * 180),
    w: 10 + Math.floor(Math.random() * 60),
    h: 10 + Math.floor(Math.random() * 60),
    src: NAMES[Math.floor(Math.random() * NAMES.length)]!,
    ...readLocation(),
  }));
  const baseImageData = useAsyncFn(
    useCallback(
      () => loadImageAsImageData(`${imageInfo.src}.bmp`),
      [imageInfo.src]
    )
  );
  const randomize = useCallback(() => {
    setImageInfo({
      src: NAMES[Math.floor(Math.random() * NAMES.length)]!,
      x: Math.floor(Math.random() * 180),
      y: Math.floor(Math.random() * 180),
      w: 10 + Math.floor(Math.random() * 60),
      h: 10 + Math.floor(Math.random() * 60),
    });
  }, []);
  const [tempPatches, setTempPatches] = useState<PartialImageData[] | null>(
    null
  );
  const tempImageData = useAsyncFn(
    useCallback(() => {
      setTempPatches(null);
      return loadImageAsImageData(`${imageInfo.src}.bmp`, imageInfo);
    }, [imageInfo])
  );
  const [tempImageHarrisFeatures, setTempImageHarrisFeatures] = useState<
    HarrisFeature[] | null
  >(null);
  useEffect(() => {
    if (tempImageData.ok && tempImageHarrisFeatures) {
      const sliced = sliceByFeatures(
        tempImageData.value,
        tempImageHarrisFeatures
      );
      setTempPatches(sliced);
    }
  }, [tempImageData, tempImageHarrisFeatures]);
  const baseImageRef = useRef<HTMLCanvasElement>(null);
  useImageDataRenderer(baseImageRef, baseImageData);
  const tempImageRef = useRef<HTMLCanvasElement>(null);
  useImageDataRenderer(tempImageRef, tempImageData);
  const resultRef = useRef<HTMLCanvasElement>(null);
  const scoreMapRef = useRef<HTMLCanvasElement>(null);
  const coOccurenceMapRef = useRef<HTMLCanvasElement>(null);
  const scoreSampleRef = useRef<HTMLCanvasElement>(null);
  const tmpRef = useRef<HTMLCanvasElement>(null);

  const draggingStartPosRef = useRef<Position | null>(null);
  const handleOnMouseDown = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const ne = e.nativeEvent;
    const x = ne.offsetX;
    const y = ne.offsetY;
    draggingStartPosRef.current = { x, y };
  }, []);
  const handleOnMouseUp = useCallback((e: MouseEvent<HTMLCanvasElement>) => {
    const ne = e.nativeEvent;
    const x = ne.offsetX;
    const y = ne.offsetY;
    const start = draggingStartPosRef.current;
    draggingStartPosRef.current = null;
    if (start) {
      const left = Math.min(x, start.x);
      const top = Math.min(y, start.y);
      setImageInfo((p: any) => ({
        ...p,
        x: left,
        y: top,
        w: Math.abs(x - start.x),
        h: Math.abs(y - start.y),
      }));
      setTempImageHarrisFeatures(null);
    }
  }, []);

  useEffect(
    function tempImageHarrisFeatureEffect() {
      if (!tempImageData.ok || !tempImageRef.current) return;

      const features = cornerDetection(tempImageData.value, 2);
      fisherYatesShuffle(features);

      const canvasEl = tempImageRef.current;
      const ctx = canvasEl.getContext("2d")!;

      ctx.fillStyle = "#ff0000";
      for (const p of features) {
        ctx.fillRect(
          p.x - p.radius,
          p.y - p.radius,
          p.radius * 2 + 1,
          p.radius * 2 + 1
        );
      }

      setTempImageHarrisFeatures(features);
    },
    [tempImageData]
  );

  useEffect(
    function naiveTemplateMatchingEffect() {
      if (
        !baseImageData.ok ||
        !tempImageData.ok ||
        !resultRef.current ||
        !tempImageHarrisFeatures
      )
        return;

      const canvasEl = resultRef.current;
      canvasEl.width = baseImageData.value.width;
      canvasEl.height = baseImageData.value.height;

      const ctx = canvasEl.getContext("2d")!;
      ctx.putImageData(baseImageData.value, 0, 0);

      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 3;
      ctx.strokeRect(imageInfo.x, imageInfo.y, imageInfo.w, imageInfo.h);
      ctx.lineWidth = 1;

      [
        async () => {
          const startTime = Date.now();
          const pos = await naiveTemplateMatchingWithWorker(
            baseImageData.value,
            tempImageData.value
          );
          console.log(
            pos.x === imageInfo.x && pos.y === imageInfo.y,
            "naive",
            pos,
            Date.now() - startTime
          );
          ctx.strokeStyle = "#ff22de";
          ctx.strokeRect(
            pos.x,
            pos.y,
            tempImageData.value.width,
            tempImageData.value.height
          );
        },
        async () => {
          const startTime = Date.now();

          const candidates = await sliceTemplateMatchingWithWorker(
            baseImageData.value,
            tempImageData.value
          );
          const mostSuitable = maxOneCandidateSelector(candidates, peekAverage);
          const matched =
            mostSuitable.pos.x === imageInfo.x &&
            mostSuitable.pos.y === imageInfo.y;
          console.log(
            matched,
            "slice",
            mostSuitable.pos,
            Date.now() - startTime
          );
          if (!matched) {
            console.log(
              `candidates contains TRUE answer?: ${Boolean(
                candidates
                  .map((x) => x.pos)
                  .find((p) => p.x === imageInfo.x && p.y === imageInfo.y)
              )}`,
              candidates
            );
          }
          ctx.strokeStyle = "#d3ff2244";
          for (const c of candidates) {
            ctx.strokeRect(
              c.pos.x,
              c.pos.y,
              tempImageData.value.width,
              tempImageData.value.height
            );
          }
          ctx.strokeStyle = "#d3ff22";
          ctx.strokeRect(
            mostSuitable.pos.x,
            mostSuitable.pos.y,
            tempImageData.value.width,
            tempImageData.value.height
          );
        },
        async () => {
          if (tempImageHarrisFeatures.length === 0) return;

          const startTime = Date.now();
          const candidates = await harrisFeatureTemplateMatchingWithWorker(
            baseImageData.value,
            tempImageData.value,
            tempImageHarrisFeatures
          );

          const mostSuitable = maxOneCandidateSelector(candidates, peekAverage);
          const matched =
            mostSuitable.pos.x === imageInfo.x &&
            mostSuitable.pos.y === imageInfo.y;
          console.log(
            matched,
            "harrisFeature",
            mostSuitable.pos,
            Date.now() - startTime
          );
          if (!matched) {
            console.log(
              `candidates contains TRUE answer?: ${Boolean(
                candidates
                  .map((x) => x.pos)
                  .find((p) => p.x === imageInfo.x && p.y === imageInfo.y)
              )}`,
              candidates
            );
          }
          ctx.strokeStyle = "#22ff7766";
          for (const c of candidates) {
            ctx.strokeRect(
              c.pos.x,
              c.pos.y,
              tempImageData.value.width,
              tempImageData.value.height
            );
          }
          ctx.strokeStyle = "#22ff77";
          ctx.strokeRect(
            mostSuitable.pos.x,
            mostSuitable.pos.y,
            tempImageData.value.width,
            tempImageData.value.height
          );
        },
      ].reduce((p, fn) => p.then(fn), Promise.resolve());
    },
    [baseImageData, tempImageData, tempImageHarrisFeatures, imageInfo]
  );

  useEffect(
    function scoreMapEffect() {
      if (!baseImageData.ok || !tempImageData.ok || !scoreMapRef.current)
        return;

      const canvasEl = scoreMapRef.current;
      canvasEl.width = baseImageData.value.width;
      canvasEl.height = baseImageData.value.height;

      const ctx = canvasEl.getContext("2d")!;
      getScoreMapWithWorker(baseImageData.value, tempImageData.value).then(
        (scoreMap) => {
          ctx.putImageData(scoreMap, 0, 0);
        }
      );
    },
    [baseImageData, tempImageData]
  );

  useEffect(
    function coOccurenceMapEffect() {
      if (!tempImageData.ok || !coOccurenceMapRef.current) return;

      const canvasEl = coOccurenceMapRef.current;
      canvasEl.width = 256;
      canvasEl.height = 256;

      const ctx = canvasEl.getContext("2d")!;
      getCoOccurrenceMap(tempImageData.value).then((scoreMap) => {
        ctx.putImageData(scoreMap, 0, 0);
      });
    },
    [tempImageData]
  );

  useEffect(
    function scoreSampleEffect() {
      if (!baseImageData.ok || !tempImageData.ok || !scoreSampleRef.current)
        return;

      const canvasEl = scoreSampleRef.current;

      const ctx = canvasEl.getContext("2d")!;
      const scoreMap = getSampleMap(256);
      ctx.putImageData(scoreMap, 0, 0);
    },
    [baseImageData, tempImageData]
  );

  useEffect(
    function tmpEffect() {
      if (!tempImageData.ok || !tmpRef.current) return;

      const canvasEl = tmpRef.current;
      canvasEl.width = tempImageData.value.width;
      canvasEl.height = tempImageData.value.height;

      const ctx = canvasEl.getContext("2d")!;
      const features = harrisCornerDetection(tempImageData.value);

      // ctx.putImageData(map, 0, 0);
    },
    [tempImageData]
  );

  return (
    <div>
      <div>
        <a href="./">top</a>
        {/* <button type="button" onClick={randomize}>
          randomize!
        </button> */}
        <select
          value={imageInfo.src}
          onChange={(e) =>
            setImageInfo((p: any) => ({ ...p, src: e.target.value }))
          }
        >
          {NAMES.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <div>
          <h2>base image</h2>
          {baseImageData.ok ? (
            <canvas
              ref={baseImageRef}
              onMouseDown={handleOnMouseDown}
              onMouseUp={handleOnMouseUp}
            />
          ) : null}
        </div>
        <div>
          <h2>template rect</h2>
          <p>base imageを矩形領域ドラッグでもテンプレートを再指定できます</p>
          {RECT_KEYS.map((v) => (
            <div key={v}>
              <label>
                {v}:
                <input
                  type="number"
                  onChange={(e) =>
                    setImageInfo((p: any) => ({
                      ...p,
                      [v]: e.target.valueAsNumber,
                    }))
                  }
                  value={imageInfo[v]}
                ></input>
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const params = new URLSearchParams();
              params.set("src", imageInfo.src);
              params.set("x", imageInfo.x);
              params.set("y", imageInfo.y);
              params.set("w", imageInfo.w);
              params.set("h", imageInfo.h);
              location.search = params.toString();
            }}
          >
            save this
          </button>
        </div>
        <div>
          <h2>template image</h2>
          {tempImageData.ok ? <canvas ref={tempImageRef} /> : null}
        </div>
        <div>
          <h2>template patches</h2>
          {tempPatches?.map((x, i) => (
            <ImageDataRenderer key={i} src={x.data} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <div>
          <h2>result</h2>

          <canvas ref={resultRef} />
        </div>
        <div>
          <h2>score map</h2>
          <div>
            <canvas ref={scoreMapRef} />
          </div>
          <div>
            <canvas ref={scoreSampleRef} />
          </div>
        </div>
        <div>
          <h2>co-occurrence map</h2>
          <div>
            <canvas ref={coOccurenceMapRef} />
          </div>
        </div>
        <div>
          <h2>tmp</h2>
          <div>
            <canvas ref={tmpRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
