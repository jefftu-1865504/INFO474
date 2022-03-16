import React, { useState } from "react"; /* ADD THIS LINE FOR STATE MANAGMENT */

import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BoxPlot } from "@visx/stats";
import { forOwn, uniq } from "lodash";


import * as d3 from "d3";
import { forEach } from "lodash";

import Legends from "./legendThreshold";

import { interpolateGreys } from "d3";

import urban_pollution_1990 from "../data/urban_pollution_1990";
import urban_pollution_2017 from "../data/urban_pollution_2017";

import urban from "../data/urban_pop_pct";
import urban_agglom from "../data/urban_agglom_pct";

import urban_total from "../data/urban_pop_total";
import urban_largest_city from "../data/urban_pop_largest_city_pct";

import MapsExample from "./mapsExampleBasemap";


function App() {

  const xvalues = urban.data.map((row, i) => { return row.Year; })
  const yvalues_bar_chart = urban_total.data.map((row, i) => { return row.urban_pop_total / 1000000; })

  const yvalues = urban.data.map((row, i) => { return row.urban_pop_pct; });
  const yvalues_agglom = urban_agglom.data.map((row, i) => { return row.urban_agglom_pct; });
  const yvalues_largest_city = urban_largest_city.data.map((row, i) => { return row.urban_pop_largest_city_pct; });
  
  const lineChartData = [{name:"Urban Population %", data: yvalues}, {name:"Urban Agglomeration %", data: yvalues_agglom}, {name: "Urban Population Largest City %", data: yvalues_largest_city}];
  
  console.log(urban_pollution_1990)

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

  const stripChartWidth = 400;
  const stripChartHeight = 100;
  const stripMargin = 20;
  const stripAxisTextPadding = 5;

  const stripPctScale = scaleLinear()
    .domain([0, 100])
    .range([stripMargin, stripChartWidth - stripMargin - stripMargin]);

  return (
    <div style={{ margin: 20, fontFamily: "Gill Sans" }}>
      
      <h1>Understanding Urban Development from 1970-2019</h1>
      <p>Jeff Tu</p>
      <p>INFO 474</p>

      <br></br>

      <div>  
      <h3>Development of the Urban Population from 1960-2019 (Average Urban Population)</h3>
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
          <AxisLeft strokeWidth={0.5} left={urbanMargin} scale={urbanBarHeightScale} label={"Total Urban Population (by millions)"} />
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
      

      <p>This bar graph showing the development of the urban population from 1960-2019 simply shows that average
        urban population has been increasing at a steady rate since 1960, which is expected as the total
        population has been growing during this time. However, when we look at the next graph, we see that
        the total urban population percentage has been increasing as well, which means that the average urban
        population has been increasing at a faster rate than the total population, signifying a greater and faster
        growth in urban population.
      </p>

      <MapsExample/>

      <h3>Urban Population Growth compared to Urban Agglomeration Growth and Urban Population in the Largest City from 1960-2019 </h3>

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
                i === 0 ? "rgba(0,0,255,1)" : i === 1 ? "rgba(255, 0, 0, 1)" : "rgba(0, 255, 0, 1)"
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
      </div>

      <p>When we look at this graph, we can clearly see that the urban population percentage from 
        1960-2019 was increasing at a steady rate. Meanwhile, the urban population percentage in each 
        country's largest city maintained a pretty steady percentage from 1960 to 2019, with only a 
        slight decrease. This may be an indicator that although urban population in the largest city
        is decreasing, urban population percentage as a whole was steadily increasing during this time
        which may show that urban areas did not develop as fast, and the population in these urban areas
        was actually increasing. This may indicate a difference in development between urban areas and 
        rural areas over this time. Additionally, when we observe urban agglomeration percentage over this
        time, we can clearly see that the urban agglomeration percentage is steadily increasing, just like
        the total urban population percentage. What does this indicate? Well, this shows that as the urban
        population increases, increasing agglomeration percentages indicate that urban built-up areas are 
        also increasing. This further proves our analysis that urban population percentages in the main 
        city may not be increasing, but the other cities in a country have increasing urban populations, as
        the areas surrounding cities are become increasingly populated.
      </p>

      <h4>Pollution Percentage Levels in 1990 (by country)</h4>

      <svg
          height={stripChartHeight}
          width={stripChartWidth}
          style={{ border: "1px solid black" }}
        >
          {urban_pollution_1990.data.map((data, i) => {
            return (
              <circle
                key={i}
                cx={stripPctScale(data.urban_pollution)}
                cy={stripChartHeight / 2}
                r={5}
                style={{ stroke: "rgba(50,50,50,.1)", fill: "none" }}
              />
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={stripChartHeight - stripMargin - stripAxisTextPadding}
            scale={stripPctScale}
            numTicks={7}
          />
        </svg>

        <h4>Pollution Percentage Levels in 2017 (by country)</h4>

        <svg
          height={stripChartHeight}
          width={stripChartWidth}
          style={{ border: "1px solid black" }}
        >
          {urban_pollution_2017.data.map((data, i) => {
            return (
              <circle
                key={i}
                cx={stripPctScale(data.urban_pollution)}
                cy={stripChartHeight / 2}
                r={5}
                style={{ stroke: "rgba(50,50,50,.1)", fill: "none" }}
              />
            );
          })}
          <AxisBottom
            strokeWidth={1}
            top={stripChartHeight - stripMargin - stripAxisTextPadding}
            scale={stripPctScale}
            numTicks={7}
          />
        </svg>
      </div>

      <p>When we observe our strip plots for pollution percentage levels in 1990 versus pollution percentage
        levels in 2017, we can see that pollution was a major problem in 1990, and continues to be a major problem 
        in 2017. According to the World Health Organization (WHO), air pollution kills an estimated seven million people worldwide every year,
        and almost the entire global population breathes air that exceed WHO guideline limits containing "high levels
        of pollutants, with low and midddle income countries suffering from the highest exposures" (WHO). Our 
        strip plots both indicate that when we group by country and observe pollution percentage levels, we see that
        most countries have near 100% pollution levels, which matches the WHO data. This is important because when
        we study urban development, we also have to keep in mind that pollution is a major factor that affects not only
        people in those major cities, but also people in urban areas and the entire global population as a whole.
      </p>

      <br></br>

      <br></br>

          <h4>Exploring Urban Development</h4>
      <p>When I selected this dataset, I seeked away to understand and answer 3 main questions. The first 
        question is: What has urban development looked like over the past 50 years (since 1960)? When I first 
        looked at the data, it became apparent that one of the best ways to understand urban development was 
        looking at how the average urban population had changed over this period of time. Through our visualizations, we
        can clearly observe that the urban population has not only been increasing at a steady rate, but also
        at a rate faster than the growth of the total population. Using our visualizations for urban population 
        percentage and total urban population, we can understand that although the average urban population has been 
        increasing at a steady rate (from approximately 7 million to over 25 million on average per country), which is
        a much faster rate of increase than the total average worldwide population. </p>
        <br></br>

        <p>Additionally, I also looked to answer the question of "How does urban development look across the entire world?" Through 
        our map visualization, we can clearly see the effect of urbanization across the world, as many countries have experienced
        increased urban growth over this time. As we can clearly see from our maps, regions across the entire world are experiencing
        more urbanization, as their urban population percentages are increasing. This means that the urban populations in these countries
        are growing at a faster rate than their total population, which also explains the steady increase in urban agglomeration.</p>
        <br></br>

        <p>Another question I seeked to answer was also linked to urbanization, which is pollution. "How has urbanization affected pollution 
        across the world from 1970 to 2017? With urbanization comes economic growth which may come in the form of factories and industries 
        that require unsustainable resources, causing an increase in pollution. However, through our strip plots we can understand that since 
        1970, there has not been much growth or developments in reducing pollution, as nearly 100% of the countries across the world are feeling the effects
        of pollution. Urbanization may be detrimental in reducing pollution because with industrial and economic growth comes the 
        need for these resources and factories that produce harmful gases and other biproducts that do not help with reducing pollution.
        Pollution is an issue that likely needs to be addressed, as global warming and other environmentally related issues are 
        at the forefront of our minds. How can we find a balance between urbanization and industrial growth, while also helping with
        reducing pollution.</p>
        <br></br>

        <p>In conclusion, we can see that the urban population has continued to grow at a rate greater than the rate
        of growth for the total population. This may be due to a variety of factors that cause urbanization.
        It's important to pay more attention to urban development and growth because the urban population makes up for 
        over half of the worldwide population, and has a great effect on economic growth. Urbanization can solve problems 
        related to population congestion, deficiencies in infrastructure and housing conditions, as well as many other 
        problems. Growth in these areas make room for employment opportunities and improved infrastructure and living 
        conditions for these people. The biggest takeaway from this project was understanding the impact of urban development,
        and how urbanization has affected the world from 1960-2019. We can clearly see that urbanization is a crucial element of 
        growth across the world, and the ways in which it affects the overall population as well as the populations in different
        countries and regions. I learned the importance of working with complete datasets, and how to wrangle data in a way that
        helps us produce better, more impactful visualizations. I also learned how different visualizations can portray different
        ideas and show overall patterns and different analyses across our data.</p>
    </div>
  );
}
export default App;
