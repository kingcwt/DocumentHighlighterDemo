import { useState } from "react";
import imageSrc from "./assets/reactimg.jpg"; // 请替换为你的图片路径
import "./doc.less";
import DocFour from "./DocFour";
import { json } from "./data";
import DataPoints from "./DataPoints";
function App() {
  let highlightData = [
    // 替换为你的实际高亮数据
    { words: "流动资产:", quad: [202, 531, 334, 531, 334, 562, 202, 562] },
    { words: "货币资金", quad: [202, 582, 323, 582, 323, 613, 202, 613] },
    // 添加更多数据
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  highlightData = [];

  json[0].data.forEach((item) => {
    return item.forEach((i) => {
      highlightData.push({ words: i.words, quad: i.quad });
    });
  });

  const [selectedHighlight, setSelectedHighlight] = useState(null);

  // const handleHighlightClick = (index) => {
  //   setSelectedHighlight(index);
  //   // 这里可以添加滚动到右侧对应数据点的逻辑
  // };

  const handleHighlightClick = (index) => {
    console.log(index, "index123");
    setActiveIndex(index);
  };

  const handleHighlightHover = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="app">
      <h1>Document Highlighter</h1>
      <div className="container">
        <DocFour
          imageSrc={imageSrc}
          highlightData={highlightData}
          onHighlightClick={handleHighlightClick}
          onHighlightHover={handleHighlightHover}
          activeIndex={activeIndex}
        />
        {/* <div className="data-points">
          {highlightData.map((item, index) => (
            <div
              key={index}
              className={`data-point ${
                selectedHighlight === index ? "selected" : ""
              }`}
              onClick={() => handleHighlightClick(index)}
            >
              {item.words}
            </div>
          ))}
        </div> */}
        <DataPoints
          data={highlightData}
          activeIndex={activeIndex}
          onItemClick={handleHighlightClick}
          onItemHover={handleHighlightHover}
        />
      </div>
    </div>
  );
}

export default App;
