import { scaleLinear } from "@visx/scale";
import { interpolateGreys } from "d3";

const xScale = Scale.scaleLinear({
  domain: [minX, maxX], // x-coordinate data values
  range: [0, graphWidth], // svg x-coordinates, svg x-coordinates increase left to right
  round: true,
});

function MyChart() {
  return (
    <div>
      <h1> Legends </h1>
      <svg>{/** chart stuff */}</svg>
      <LegendLinear
        scale={threshold}
        direction="column-reverse"
        itemDirection="row-reverse"
        labelMargin="0 20px 0 0"
        shapeMargin="1px 0 0"
      />
    </div>
  );
}
