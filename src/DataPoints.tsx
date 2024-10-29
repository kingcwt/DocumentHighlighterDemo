
const DataPoints = ({ data, activeIndex, onItemClick, onItemHover }) => {
  return (
    <div className="data-points">
      {data.map((item, index) => (
        <div 
          key={index}
          className={`data-point ${index === activeIndex ? 'active' : ''}`}
          onClick={() => onItemClick(index)}
          onMouseEnter={() => onItemHover(index)}
          onMouseLeave={() => onItemHover(null)}
        >
          {item.words}
        </div>
      ))}
    </div>
  );
};

export default DataPoints;