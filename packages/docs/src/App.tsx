import { getSampleMap, sliceImages } from "@berlysia/template-matching";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageDataRenderer } from "./ImageDataRenderer";
import { loadImageAsImageData } from "./loadImageAsImageData";
import { useAsyncFn } from "./useAsyncFn";
import { naiveTemplateMatching as naiveTemplateMatchingWithWorker } from "./withWorker/naiveTemplateMatchingWithWorker";
import { sliceTemplateMatching as sliceTemplateMatchingWithWorker } from "./withWorker/sliceTemplateMatchingWithWorker";
import { getScoreMap as getScoreMapWithWorker } from "./withWorker/getScoreMapWithWorker";
import { getCoOccurrenceMap } from "./withWorker/getCoOccurenceMapWithWorker";

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

function App() {
  const [imageSrc, setImageSrc] = useState(
    NAMES[Math.floor(Math.random() * NAMES.length)]!
  );
  const baseImageData = useAsyncFn(
    useCallback(() => loadImageAsImageData(`${imageSrc}.bmp`), [imageSrc])
  );
  const [tempImageRect, setTempImageRect] = useState(() => ({
    x: Math.floor(Math.random() * 180),
    y: Math.floor(Math.random() * 180),
    w: 1 + Math.floor(Math.random() * 60),
    h: 1 + Math.floor(Math.random() * 60),
  }));
  const tempImageData = useAsyncFn(
    useCallback(
      () => loadImageAsImageData(`${imageSrc}.bmp`, tempImageRect),
      [imageSrc, tempImageRect]
    )
  );
  const resultRef = useRef<HTMLCanvasElement>(null);
  const scoreMapRef = useRef<HTMLCanvasElement>(null);
  const coOccurenceMapRef = useRef<HTMLCanvasElement>(null);
  const scoreSampleRef = useRef<HTMLCanvasElement>(null);

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
      setTempImageRect({
        x: left,
        y: top,
        w: Math.abs(x - start.x),
        h: Math.abs(y - start.y),
      });
    }
  }, []);

  useEffect(
    function naiveTemplateMatchingEffect() {
      if (!baseImageData.ok || !tempImageData.ok || !resultRef.current) return;

      const canvasEl = resultRef.current;
      canvasEl.width = baseImageData.value.width;
      canvasEl.height = baseImageData.value.height;

      const ctx = canvasEl.getContext("2d")!;
      ctx.putImageData(baseImageData.value, 0, 0);

      const startTime = Date.now();
      naiveTemplateMatchingWithWorker(
        baseImageData.value,
        tempImageData.value
      ).then((pos) => {
        console.log("naive", pos, Date.now() - startTime);
        ctx.strokeStyle = "#ff22de";
        ctx.strokeRect(
          pos.x,
          pos.y,
          tempImageData.value.width,
          tempImageData.value.height
        );
      });
      sliceTemplateMatchingWithWorker(
        baseImageData.value,
        tempImageData.value
      ).then((pos) => {
        console.log("slice", pos, Date.now() - startTime);
        ctx.strokeStyle = "#d3ff22";
        ctx.strokeRect(
          pos.x,
          pos.y,
          tempImageData.value.width,
          tempImageData.value.height
        );
      });
    },
    [baseImageData, tempImageData]
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
        console.log(scoreMap);
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

  return (
    <div>
      <div>
        <select value={imageSrc} onChange={(e) => setImageSrc(e.target.value)}>
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
            <ImageDataRenderer
              src={baseImageData.value}
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
                    setTempImageRect((p) => ({
                      ...p,
                      [v]: e.target.valueAsNumber,
                    }))
                  }
                  value={tempImageRect[v]}
                ></input>
              </label>
            </div>
          ))}
        </div>
        <div>
          <h2>template image</h2>
          {tempImageData.ok ? (
            <ImageDataRenderer src={tempImageData.value} />
          ) : null}
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
      </div>
    </div>
  );
}

export default App;
