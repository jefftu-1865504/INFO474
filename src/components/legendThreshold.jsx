import { LegendThreshold } from "@visx/legend";
import { scaleThreshold } from "@visx/scale";

const threshold = scaleThreshold({
  domain: [0.25, 0.5, 0.75, 1],
  range: ["rgb(255, 0, 0)", "rgb(255, 69, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)"],
});

const Legends = () => {
  return (
    <div>
      <svg>{/** chart stuff */}</svg>
      <div style={{ display: "flex" }}>
        <LegendThreshold
          scale={threshold}
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
