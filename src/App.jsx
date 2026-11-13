import { useLayoutEffect, useRef, useState } from "react";
import { scaleLinear, scaleBand } from "d3-scale";
import "./App.css";
import { data } from "./data";
import { chartStyle } from "./style";

const heightPlot = 360;

// Measures the width of an element and updates whenever it is resized
// (window resize, phone rotation, etc.)
function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, width];
}

function Chart({ widthPanel }) {
  // On narrow screens, long text is split into two lines, so the
  // top and bottom margins need more room.
  const narrow = widthPanel < 520;

  const margin = {
    top: narrow ? 112 : 95,
    right: 20,
    bottom: narrow ? 73 : 55,
    left: 20,
  };

  const widthPlot = widthPanel - margin.left - margin.right;
  const heightPanel = heightPlot + margin.top + margin.bottom;

  const xScale = scaleLinear()
    .domain([0, Math.max(...data.map((d) => d.count))])
    .range([0, widthPlot]);

  const yScale = scaleBand()
    .domain(data.map((d) => d.name))
    .range([heightPlot, 0])
    .padding(0.4);

  // fewer gridlines when there is less room, so the labels don't collide
  const ticks = xScale.ticks(narrow ? 5 : 10);

  // y position of the first caption line, just below the plot
  const captionY = margin.top + heightPlot + 25;

  return (
    <svg width={widthPanel} height={heightPanel}>
      {/* Economist style: red rule across the top of the panel */}
      <line
        x1={margin.left}
        x2={widthPanel - margin.right}
        y1={0.5}
        y2={0.5}
        stroke={chartStyle.topLine.stroke}
        strokeWidth={chartStyle.topLine.strokeWidth}
      />
      {/* ...and a small red tab just below it, aligned with the title */}
      <rect
        x={margin.left}
        y={0}
        width={chartStyle.topTab.width}
        height={chartStyle.topTab.height}
        fill={chartStyle.topTab.fill}
      />

      {/* Title + subtitle: panel coordinates, outside the plot group */}
      <text
        x={margin.left}
        y={38}
        fontSize={chartStyle.title.fontSize}
        fontWeight={chartStyle.title.fontWeight}
        fill={chartStyle.title.fill}
      >
        Escape artists
      </text>
      <text
        y={62}
        fontSize={chartStyle.subtitle.fontSize}
        fill={chartStyle.subtitle.fill}
      >
        {narrow ? (
          <>
            {/* <tspan> = a line inside a <text>; dy moves it down */}
            <tspan x={margin.left}>Number of laboratory-acquired</tspan>
            <tspan x={margin.left} dy={18}>
              infections, 1970–2021
            </tspan>
          </>
        ) : (
          <tspan x={margin.left}>
            Number of laboratory-acquired infections, 1970–2021
          </tspan>
        )}
      </text>

      {/* Plot: everything inside is shifted into place once */}
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Gridlines + tick labels (drawn first, so they sit behind the bars) */}
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={0}
              y2={heightPlot}
              stroke={tick === 0 ? "currentColor" : "#e0e0e0"}
            />
            <text
              x={xScale(tick)}
              y={-8}
              textAnchor="middle"
              fontSize={chartStyle.axis.fontSize}
              fill={chartStyle.axis.fill}
            >
              {tick}
            </text>
          </g>
        ))}

        {/* Bars and labels */}
        {data.map((d) => (
          <g key={d.name}>
            <rect
              x={0}
              y={yScale(d.name)}
              width={xScale(d.count)}
              height={yScale.bandwidth()}
              fill="steelblue"
            />
            <text
              x={d.count >= 9 ? 5 : xScale(d.count) + 5}
              y={yScale(d.name) + yScale.bandwidth() / 2}
              dominantBaseline="middle"
              fill={d.count >= 9 ? "white" : "#0570a3"}
              fontSize={chartStyle.axis.fontSize}
            >
              {d.name}
            </text>
          </g>
        ))}
      </g>

      {/* Caption: panel coordinates, in the bottom margin below the plot */}
      <text
        y={captionY}
        fontSize={chartStyle.caption.fontSize}
        fill={chartStyle.caption.fill}
      >
        {narrow ? (
          <>
            <tspan x={margin.left}>
              Sources: Laboratory-Acquired Infection Database;
            </tspan>
            <tspan x={margin.left} dy={18}>
              American Biological Safety Association
            </tspan>
          </>
        ) : (
          <tspan x={margin.left}>
            Sources: Laboratory-Acquired Infection Database; American Biological
            Safety Association
          </tspan>
        )}
        <tspan x={margin.left} dy={18}>
          The Economist
        </tspan>
      </text>
    </svg>
  );
}

function App() {
  const [chartRef, chartWidth] = useContainerWidth();

  return (
    <>
      <h2 className="page-title">
        Project: Recreating a graph from the Economist
      </h2>
      <div className="chart" ref={chartRef}>
        {/* width is 0 until the first measurement, so wait for it */}
        {chartWidth > 0 && <Chart widthPanel={chartWidth} />}
      </div>
    </>
  );
}

export default App;
