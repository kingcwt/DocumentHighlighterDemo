import { useCallback, useEffect, useRef, useState } from "react";
import "./d.less";

const DocFour = ({
  imageSrc,
  highlightData,
  onHighlightClick,
  activeIndex,
  onHighlightHover,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      canvas.width = 2480;
      canvas.height = 3507;
      ctx.drawImage(image, 0, 0, 2480, 3507);

      // 初始化缩放以适应容器
      const container = containerRef.current!;
      const containerAspectRatio =
        container.clientWidth / container.clientHeight;
      const imageAspectRatio = 2480 / 3507;
      let initialScale;
      if (containerAspectRatio > imageAspectRatio) {
        initialScale = container.clientHeight / 3507;
      } else {
        initialScale = container.clientWidth / 2480;
      }
      setScale(initialScale);
    };
  }, [imageSrc]);

  useEffect(() => {
    updateSVGHighlights();
  });

  const updateSVGHighlights = () => {
    const svg = svgRef.current!;
    svg.innerHTML = "";
    highlightData.forEach((item, index) => {
      const [x1, y1, x2, y2, x3, y3, x4, y4] = item.quad.split(",");
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
      polygon.setAttribute(
        "fill",
        index === activeIndex ? "rgba(41,111,255,.4)" : "rgba(0, 0, 0, 0.12)"
      );
      polygon.setAttribute(
        "stroke",
        index === activeIndex ? "rgba(0,24,255,.5)" : ""
      );
      polygon.setAttribute("stroke-width", index === activeIndex ? "2px" : "");
      polygon.setAttribute("opacity", index === activeIndex ? "0.9" : "0.9");
      polygon.setAttribute("cursor", "pointer");
      polygon.setAttribute("data-index", index.toString());
      polygon.addEventListener("mouseenter", () => onHighlightHover(index));
      polygon.addEventListener("mouseleave", () => onHighlightHover(null));

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

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale((prevScale) => {
      const newScale = Math.max(0.1, Math.min(prevScale + delta, 5));
      return newScale;
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [handleWheel]);

  return (
    <div
      className="move-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "relative",
        overflow: "hidden",
        // width: '342.971px',
        // height: '485px'
        // width:800,
        // height:800
      }}
    >
      <canvas
        ref={canvasRef}
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
          pointerEvents: "auto",
        }}
      />
    </div>
  );
};

export default DocFour;
