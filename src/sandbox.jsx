import { scaleLinear } from "d3";

const data = [
  { x: 0, y: 40 },
  { x: 50, y: 80 },
  { x: 60, y: 20 },
  { x: 82, y: 65 },
  { x: 100, y: 10 },
];

const width = 500;
const height = 300;

const sandbox = () => {
  const xScale = scaleLinear().domain([0, 100]).range([0, width]);

  const yScale = scaleLinear().domain([0, 100]).range([height, 0]);

  return (
    <svg width={width} height={height}>
      <rect width={width} height={height} fill="#f8f8f8" rx={4} />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={xScale(d.x)}
          cy={yScale(d.y)}
          r={16}
          fill="#69b3a2"
          opacity={0.8}
        />
      ))}
    </svg>
  );
};
export default sandbox;
