// src/DocumentHighlighter.js
import React, { type RefObject, useEffect, useRef, useState } from "react";
import "./doc.less";

const TryDocOne = ({ imageSrc, highlightData, onHighlightClick }: any) => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const svgRef: RefObject<SVGSVGElement> = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null!);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      if (containerRef?.current) {
        ctx.imageSmoothingEnabled = false;
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight; // 假设容器高度也是600

        // 设置画布的实际绘制表面尺寸
        canvas.width = image.width;
        canvas.height = image.height;

        // 计算缩放比例
        const scale = Math.min(
          containerWidth / image.width,
          containerHeight / image.height
        );
        console.log(scale, "fuck123");
        setScale(scale);

        // 计算绘制尺寸
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;

        // 计算绘制位置（居中）
        const x = (containerWidth - drawWidth) / 2;
        const y = (containerHeight - drawHeight) / 2;
        setOffset({ x, y });

        drawCanvas(ctx, image, x, y, drawWidth, drawHeight);
        setCanvasSize({ width: drawWidth, height: drawHeight });

        // 更新SVG高亮位置
        updateSVGHighlights(scale, x, y);
      }
    };
  }, [imageSrc]);

  const drawCanvas = (
    ctx: CanvasRenderingContext2D | null,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
  };

  const updateSVGHighlights = (
    scaleRatio: number,
    offsetX: number,
    offsetY: number
  ) => {
    const svg = svgRef.current!;
    svg.innerHTML = "";
    highlightData.forEach(
      (
        item: { quad: [any, any, any, any, any, any, any, any] },
        index: { toString: () => string }
      ) => {
        const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad;

        // 缩放并偏移高亮点的坐标
        const scaledX1 = x1 * scaleRatio + offsetX;
        const scaledY1 = y1 * scaleRatio + offsetY;
        const scaledX2 = x2 * scaleRatio + offsetX;
        const scaledY2 = y2 * scaleRatio + offsetY;
        const scaledX3 = x3 * scaleRatio + offsetX;
        const scaledY3 = y3 * scaleRatio + offsetY;
        const scaledX4 = x4 * scaleRatio + offsetX;
        const scaledY4 = y4 * scaleRatio + offsetY;

        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          `${scaledX1},${scaledY1} ${scaledX2},${scaledY2} ${scaledX3},${scaledY3} ${scaledX4},${scaledY4}`
        );
        polygon.setAttribute("fill", "yellow");
        polygon.setAttribute("opacity", "0.5");
        polygon.setAttribute("data-index", index.toString());
        polygon.addEventListener("click", () => onHighlightClick(index));
        svg.appendChild(polygon);
      }
    );
  };

  const handleZoomIn = () => setScale((prevScale) => prevScale * 1.2);
  const handleZoomOut = () => setScale((prevScale) => prevScale / 1.2);

  const drawCanvasAndUpdateHighlights = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      // 计算绘制尺寸
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;

      // 计算绘制位置（居中）
      const x = offset.x;
      const y = offset.y;

      drawCanvas(ctx, image, x, y, drawWidth, drawHeight);

      // 更新SVG高亮位置
      updateSVGHighlights(scale, x, y);
    };
  };

  const handleZoom = (delta: number) => {
    console.log(scale, delta, "info");
    const newScale = scale + delta;
    setScale(newScale);
    drawCanvasAndUpdateHighlights();
  };

  const handleDrag = (dx, dy) => {
    const newOffset = { x: offset.x + dx, y: offset.y + dy };
    setOffset(newOffset);
    drawCanvasAndUpdateHighlights();
  };

  useEffect(() => {
    const handleMouseWheel = (e: { deltaY: number }) => {
      if (e.deltaY > 0) {
        handleZoom(-0.1);
      } else {
        handleZoom(0.1);
      }
    };

    const handleMouseDown = (e: { button: number }) => {
      if (e.button === 0) {
        // 左键按下
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: { movementX: any; movementY: any }) => {
      // 计算拖动的距离
      const dx = e.movementX;
      const dy = e.movementY;
      handleDrag(dx, dy);
    };

    containerRef.current.addEventListener("wheel", handleMouseWheel);
    containerRef.current.addEventListener("mousedown", handleMouseDown);

    return () => {
      containerRef.current.removeEventListener("wheel", handleMouseWheel);
      containerRef.current.removeEventListener("mousedown", handleMouseDown);
    };
  }, [offset, scale]);

  return (
    <div className="result">
      <div className="result-left">
        <div className="result-left-content">
          <div
            className="canvas-container"
            ref={containerRef}
            style={{ position: "relative" }}
          >
            <div className="move-container">
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              ></canvas>
              <svg
                ref={svgRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  cursor: "default",
                }}
              ></svg>
            </div>
          </div>
        </div>
      </div>
      <div className="zoom-controls">
        <button onClick={() => handleZoom(-0.1)}>缩小</button>
        <button onClick={() => handleZoom(0.1)}>放大</button>
      </div>
    </div>
  );
};

export default TryDocOne;
