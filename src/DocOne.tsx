// src/DocumentHighlighter.js
import React, { useEffect, useRef, useState } from "react";
import "./doc.less";

const DocOne = ({ imageSrc, highlightData, onHighlightClick }) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      setCanvasSize({ width: image.width, height: image.height });
      drawCanvas(ctx, image, scale);
    };
  }, [imageSrc]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');
  //   const image = new Image();
  //   image.src = imageSrc;
  //   drawCanvas(ctx, image, scale);
  //   updateSVGHighlights();
  // }, [scale, highlightData]);

  const drawCanvas = (ctx, image, scale) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
  };

  const updateSVGHighlights = () => {
    const svg = svgRef.current;
    svg.innerHTML = '';
    highlightData.forEach((item, index) => {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad;
      const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      polygon.setAttribute(
        "points",
        `${x1 * scale},${y1 * scale} ${x2 * scale},${y2 * scale} ${x3 * scale},${y3 * scale} ${x4 * scale},${y4 * scale}`
      );
      polygon.setAttribute("fill", "yellow");
      polygon.setAttribute("opacity", "0.5");
      polygon.setAttribute("data-index", index.toString());
      polygon.addEventListener('click', () => onHighlightClick(index));
      svg.appendChild(polygon);
    });
  };

  const handleZoomIn = () => setScale(prevScale => prevScale * 1.2);
  const handleZoomOut = () => setScale(prevScale => prevScale / 1.2);

  return (
    <div className="result">
      <div className="result-left">
        <div className="result-left-content">
          <div className="canvas-container" style={{ position: 'relative' }}>
            <canvas ref={canvasRef}></canvas>
            <svg
              ref={svgRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: canvasSize.width * scale,
                height: canvasSize.height * scale,
              }}
            ></svg>
          </div>
        </div>
      </div>
      <div className="zoom-controls">
        <button onClick={handleZoomIn}>放大</button>
        <button onClick={handleZoomOut}>缩小</button>
      </div>
    </div>
  );
};

export default DocOne;