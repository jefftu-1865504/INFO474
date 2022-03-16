// adapted from https://bl.ocks.org/d3noob/f052595e2f92c0da677c67d5cf6f98a1

import * as topojson from "topojson-client";
import worldTopo from "../data/world-topo";
import { geoMercator, geoPath } from "d3-geo";

import Legends from "./legendThreshold";

import urban_pop_by_country from "../data/urban_pop_by_country";

const _worldTopo = topojson.feature(worldTopo, worldTopo.objects.units);
const countryShapes = _worldTopo.features;

// for assignment 2
function get_urban_pop_for_year(year) {
  const data_urban_pop = urban_pop_by_country.data.filter(x => x.Year == year);
  const urban_pop_dict = {};
  data_urban_pop.forEach(x => urban_pop_dict[x.country] = x.urban_pop_pct);
  return urban_pop_dict;
}

const urban_pop_1990 = get_urban_pop_for_year(1990);
const urban_pop_2017 = get_urban_pop_for_year(2017);

function pct_to_rgb(pct) {  
  return pct < 25 ? "rgb(255, 0, 0)" : pct < 50 ? "rgb(255,69,0)" : pct < 75 ? "rgb(255,255,0)" : "rgb(0, 255, 0)";
}

const MapsExample = ({ width = 960, height = 500 }) => {
  const projection = geoMercator().center([0, 5]).scale(150).rotate([0, 0]);
  const path = geoPath().projection(projection);

  return (
    <div>

      <h3>Urban Population Percentage in 1990</h3>
      <svg width={width} height={height}>
        <g>
          {countryShapes.map((shape, i) => {
            return (
              <path
                key={i}
                onClick={() => {
                  console.log(shape);
                }}
                d={path(shape)}
                fill={pct_to_rgb(urban_pop_1990[shape.id])}
                stroke="white"
                strokeWidth={0.3}
              />
            );
          })}          
        </g>
      </svg>

      <h3>Urban Population Percentage in 2017</h3>
      <svg width={width} height={height}>
        <g>
          {countryShapes.map((shape, i) => {
            return (
              <path
                key={i}
                onClick={() => {
                  console.log(shape);
                }}
                d={path(shape)}
                fill={pct_to_rgb(urban_pop_2017[shape.id])}
                stroke="white"
                strokeWidth={0.3}
              />
            );
          })}
        </g>
      </svg>

      <Legends/>

      <p>When we observe the urban population percentage maps, we can clearly see some differences between 
        the urban population percentage in 1990 versus 2017. First off, we notice that in both 1990 and 2017,
        the disparity between the urban population percentages in the eastern regions and the western regions
        is very large. In the West, many of the countries are mostly urbanized, and still continuing to grow increasingly 
        urban. In the East, the case is the same as countries were not as urbanized, but are still continue to grow
        increasingly urban. Knowing that the urban populations are growing is just a small part of understanding what 
        urban growth means for our planet as a whole, and what that means for other factors such as urban agglomeration and 
        pollution.
      </p>
    </div>
  );
};

export default MapsExample;
