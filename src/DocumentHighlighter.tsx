// src/DocumentHighlighter.js
import React, { useEffect, useRef } from "react";
import "./doc.less";
const DocumentHighlighter = ({ imageSrc, highlightData }) => {
  const svgRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const img = imgRef.current;

    const handleLoad = () => {
      const width = img.clientWidth;
      const height = img.clientHeight;

      svg.setAttribute("width", width);
      svg.setAttribute("height", height);

      highlightData.forEach((item) => {
        const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad;
        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          `${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`
        );
        polygon.setAttribute("fill", "yellow");
        polygon.setAttribute("opacity", "0.5");
        svg.appendChild(polygon);
      });
    };

    if (img) {
      (img as HTMLImageElement).addEventListener("load", handleLoad);
    }
    return () => (img as any).removeEventListener("load", handleLoad);
  }, [highlightData]);

  return (
    <div className="result">
      <div className="result-left">
        <div className="result-left-content">
          <div className="canvas-container">
            <div className="move-container">
              <img ref={imgRef} src={imageSrc} alt="Document" className="img" />
              <svg
                ref={svgRef}
                style={{ position: "absolute", top: 0, left: 0 }}
              ></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentHighlighter;
