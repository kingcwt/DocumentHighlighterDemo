import React, { useEffect, useRef, useState } from "react";
import "./doc.less";

const DocTwo = ({ imageSrc, highlightData, onHighlightClick }) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const image = new Image();

    image.src = imageSrc;
    image.onload = () => {
      const containerWidth = containerRef.current.clientWidth;
      const aspectRatio = image.height / image.width;
      const newWidth = Math.min(containerWidth, 600); // 限制最大宽度为600px
      const newHeight = newWidth * aspectRatio;

      setCanvasSize({ width: newWidth, height: newHeight });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = newWidth;
      canvas.height = newHeight;
      drawCanvas(ctx, image, newWidth, newHeight);
    };

    image.onerror = (error) => {
      alert(`Error loading image:${error}`);
    };
  }, [imageSrc, containerRef, onHighlightClick]);

  useEffect(() => {
    updateSVGHighlights();
  }, [scale, highlightData, canvasSize]);

  const drawCanvas = (ctx, image, width, height) => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
  };

  const updateSVGHighlights = () => {
    const svg = svgRef.current;
    svg.innerHTML = "";
    const scaleX = canvasSize.width / 2480; // 假设原图宽度为2480
    const scaleY = canvasSize.height / 3507; // 假设原图高度为3507

    highlightData.forEach((item, index) => {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad;
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute(
        "points",
        `${x1 * scaleX},${y1 * scaleY} ${x2 * scaleX},${y2 * scaleY} ${
          x3 * scaleX
        },${y3 * scaleY} ${x4 * scaleX},${y4 * scaleY}`
      );
      polygon.setAttribute("fill", "yellow");
      polygon.setAttribute("opacity", "0.5");
      polygon.setAttribute("data-index", index.toString());
      polygon.addEventListener("click", () => onHighlightClick(index));
      svg.appendChild(polygon);
    });
  };

  return (
    <div className="result" ref={containerRef}>
      <div className="result-left">
        <div className="result-left-content">
          <div
            className="canvas-container"
            style={{
              position: "relative",
              width: canvasSize.width,
              height: canvasSize.height,
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
            ></canvas>
            <svg
              ref={svgRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocTwo;
