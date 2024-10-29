import React, { useEffect, useRef, useState } from "react";
import "./doc.less";

const DocThree = ({ imageSrc, highlightData, onHighlightClick }) => {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    console.log(imageSrc, "imageSrc");
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      if (imageSrc) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = image.height / image.width;
        const newWidth = Math.min(containerWidth, 600); // 限制最大宽度为600px
        const newHeight = newWidth * aspectRatio;

        console.log(newWidth, newHeight, "lookjqds");
        setCanvasSize({ width: newWidth, height: newHeight });

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        canvas.width = newWidth;
        canvas.height = newHeight;
        drawCanvas(ctx, image, newWidth, newHeight);
      }
    };
  }, [imageSrc]);

  useEffect(() => {
    updateSVGHighlights();
  }, [scale, position, highlightData]);

  const drawCanvas = (ctx, image, width, height) => {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
  };

  const updateSVGHighlights = () => {
    const svg = svgRef.current;
    // svg.innerHTML = "";
    highlightData.forEach((item, index) => {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad;
      const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );
      polygon.setAttribute(
        "points",
        `${x1 * scale + position.x},${y1 * scale + position.y} 
         ${x2 * scale + position.x},${y2 * scale + position.y} 
         ${x3 * scale + position.x},${y3 * scale + position.y} 
         ${x4 * scale + position.x},${y4 * scale + position.y}`
      );
      polygon.setAttribute("fill", "yellow");
      polygon.setAttribute("opacity", "0.5");
      polygon.setAttribute("data-index", index.toString());
      polygon.addEventListener("click", () => onHighlightClick(index));
      svg.appendChild(polygon);
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.max(0.1, Math.min(scale + delta, 5));
    setScale(newScale);
  };

  return (
    <div
      className="canvas-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        position: "relative",
        // width: canvasSize.width,
        // height: canvasSize.height,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
      />
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default DocThree;
