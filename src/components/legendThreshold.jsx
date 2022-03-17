import { LegendThreshold } from "@visx/legend";
import { scaleThreshold } from "@visx/scale";
import { format } from "d3";

const threshold = scaleThreshold({
  domain: [0.2, 0.4, 0.6, 0.8, 1],
  range: ["rgb(255, 0, 0)", "rgb(255, 69, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 0)"],
});

const Legends = () => {
  return (
    <div>
      <svg>{/** chart stuff */}</svg>
      <div style={{ display: "flex" }}>
        <LegendThreshold
          scale={threshold}
          labelFormat={(f, i) => { return parseInt(100*f) +"%"; }}
          direction="column-reverse"
          itemDirection="row-reverse"
          labelMargin="0 20px 0 0"
          shapeMargin="1px 0 0"
        />
      </div>
    </div>
  );
};

export default Legends;
