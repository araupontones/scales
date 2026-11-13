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

      {/* Link to the source code on GitHub */}
      <a
        className="github-link"
        href="https://github.com/araupontones/scales"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View the source code on GitHub"
        title="View the source code on GitHub"
      >
        <GitHubIcon />
      </a>
    </>
  );
}

// GitHub logo (the official "mark" shape) as an inline SVG,
// coloured with currentColor so it follows the text colour
function GitHubIcon({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default App;
