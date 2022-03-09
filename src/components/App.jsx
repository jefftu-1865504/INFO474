import React, { useState } from "react"; /* ADD THIS LINE FOR STATE MANAGMENT */

import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BoxPlot } from "@visx/stats";
import { forOwn, uniq } from "lodash";


import * as d3 from "d3";
import { forEach } from "lodash";

//import Pie from "./pie";

import Legends from "./legendThreshold";

import { interpolateGreys } from "d3";

import urban from "../data/urban_pop_pct";
import urban_agglom from "../data/urban_agglom_pct";

import urban_total from "../data/urban_pop_total";



function App() {

  const xvalues = urban.data.map((row, i) => { return row.Year; })
  const yvalues_bar_chart = urban_total.data.map((row, i) => { return row.urban_pop_total / 1000000; })
  //console.log(yvalues_bar_chart)
  //console.log(xvalues);
  const yvalues = urban.data.map((row, i) => { return row.urban_pop_pct; })
  const yvalues_agglom = urban_agglom.data.map((row, i) => { return row.urban_agglom_pct; })
  
  const lineChartData = [{name:"Urban Population %", data: yvalues}, {name:"Urban Agglomeration %", data: yvalues_agglom}]
  //console.log(lineChartData)
  

  const minYear = d3.min(xvalues);
  const maxYear = d3.max(xvalues);
  const urbanChartWidth = 600;
  const urbanChartHeight = 400;
  const urbanMargin = 60;
  const urbanAxisTextPadding = 5;

  const urbanYearScale = scaleLinear()
    .domain([minYear, maxYear])
    .range([urbanMargin, urbanChartWidth - urbanMargin - urbanMargin]);

  const urbanBarHeightScale = scaleLinear()
    .domain([0, Math.max(40, d3.max(yvalues_bar_chart))])
    .range([
      urbanChartHeight - urbanMargin - urbanAxisTextPadding,
      urbanMargin
    ]);

  const _scaleY_bar = scaleLinear()
    .domain([0, d3.max(yvalues_bar_chart)])
    .range([urbanChartHeight - urbanMargin, urbanMargin]);

  const chartSize = 500;
  const margin = 90;
  const legendPadding = 200;
  const _extent = extent(yvalues);
  const _scaleY = scaleLinear()
    .domain([0, 100])
    .range([chartSize - margin, margin]);
  const _scaleLine = scaleLinear()
    .domain([0, _extent[1]])
    .range([margin, chartSize - margin]);

  const decades = xvalues.filter((x) => { return x % 10 == 0; });
  const _scaleDate = scaleBand()
    .domain(uniq(decades))
    .range([0, chartSize - margin - margin]);
    
  const _lineMaker = line()
    .x((d, i) => {
      return _scaleLine(i);
    })
    .y((d) => {
      return _scaleY(d);
    });

  return (
    <div style={{ margin: 20, fontFamily: "Gill Sans" }}>
      
      <div>
  
      <h3>Development of the Urban Population from 1960-2019 (Total Urban Population)</h3>
      <div>
        <svg width={urbanChartWidth} height={urbanChartHeight}>
          {yvalues_bar_chart.map((y, i) => {
            return(
              <rect              
                strokeWidth={1}
                stroke="rgb(0,0,0)"
                key={minYear+i}
                fill="steelblue"                
                x = {urbanYearScale(minYear+i)}
                y={urbanBarHeightScale(y)}
                width={10}
                height={
                  urbanBarHeightScale(0) - urbanBarHeightScale(y)
                }
              />
            );
          })}          
          <AxisLeft strokeWidth={0.5} left={urbanMargin} scale={urbanBarHeightScale} label={"Total Urban Population"} />
          <AxisBottom
            strokeWidth={1}
            top={urbanChartHeight - urbanMargin - urbanAxisTextPadding}
            scale={urbanYearScale}
            numTicks={7}
            tickFormat={d3.format("d")}
            label={"Year"}
          />
        </svg>
      </div>

      <h3>Urban Population Growth compared to Urban Agglomeration Growth from 1960-2019 </h3>

      <div style={{ display: "flex" }}>

      <svg
          width={chartSize + legendPadding}
          height={chartSize}
          key={"a"}      
        >
          <AxisLeft strokeWidth={0.5} left={margin} scale={_scaleY} label={"Population Percentage out of Total Population"} />
          <AxisBottom
            strokeWidth={0.5}
            top={chartSize - margin}
            left={margin}
            scale={_scaleDate}
            tickValues={decades}
            label={"Year"}
          />

          {lineChartData.map((data, i) => {
            return  <path
            stroke={
                i === 0 ? "rgba(0,0,255,1)" : "rgba(255, 0, 0, 1)"
            }
            strokeWidth={1}
            fill={"none"}
            key={xvalues}
            d={_lineMaker(data["data"])}
          />
          }
          )}
          {lineChartData.map((data, i) => {
            return <text
                fill={"black"}
                style={{
                  fontSize: 10,
                  fontWeight: 300,
                }}
                key={xvalues}
                x={chartSize - margin + 5}
                y={_scaleY(data["data"][data["data"].length-1])}
              >
                {data["name"]}
              </text>
          })}
      </svg>
      </div> </div>
    </div>
  );
}
export default App;
