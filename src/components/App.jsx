import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BoxPlot } from "@visx/stats";
import { forOwn, uniq } from "lodash";

import * as d3 from "d3";
import { forEach } from "lodash";

import { interpolateGreys } from "d3";

import urbanimg from "../img/urbandev.jpg";

import urban_pollution_1990 from "../data/urban_pollution_1990";
import urban_pollution_2017 from "../data/urban_pollution_2017";

import urban_pop_density from "../data/pop_density";

import urban from "../data/urban_pop_pct";
import urban_agglom from "../data/urban_agglom_pct";

import urban_total from "../data/urban_pop_total";
import urban_largest_city from "../data/urban_pop_largest_city_pct";

import * as topojson from "topojson-client";
import worldTopo from "../data/world-topo";
import { geoMercator, geoPath } from "d3-geo";

import Legends from "./legendThreshold";

import urban_pop_by_country from "../data/urban_pop_by_country";
import "../style/style.css";

const _worldTopo = topojson.feature(worldTopo, worldTopo.objects.units);
const countryShapes = _worldTopo.features;

const urban_pop_by_year = {};
function get_urban_pop_for_year(year) {
  if (year in urban_pop_by_year) {
    return urban_pop_by_year[year];
  }
  const data_urban_pop = urban_pop_by_country.data.filter(
    (x) => x.Year == year
  );
  const urban_pop_dict = {};
  data_urban_pop.forEach((x) => (urban_pop_dict[x.country] = x.urban_pop_pct));
  urban_pop_by_year[year] = urban_pop_dict;
  return urban_pop_dict;
}
for (let i = 1990; i <= 2017; i++) {
  get_urban_pop_for_year(i);
}

function pct_to_rgb(pct) {
  return pct < 20
    ? "rgb(255, 0, 0)"
    : pct < 40
    ? "rgb(255,69,0)"
    : pct < 60
    ? "rgb(0, 0, 255)"
    : pct < 80
    ? "rgb(255,255,0)"
    : "rgb(0, 255, 0)";
}

function App() {
  const Header = () => {
    return (
      <div
        style={{
          height: "400px",
          width: "100%",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${urbanimg})`,
        }}
      ></div>
    );
  };

  const [selectedYear, setSelectedYear] = useState(1990);
  const [selectedLines, setSelectedLines] = useState([true, true, true]);

  //setTimeout(() => {setSelectedYear(1990 + (selectedYear + 1) % (2017 - 1990))}, 2000);

  const Maps = ({ width = 960, height = 500 }) => {
    const projection = geoMercator().center([0, 5]).scale(150).rotate([0, 0]);
    const path = geoPath().projection(projection);

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2>Introduction</h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <p>
            As of 2020, over 54% of the entire global population resided in
            urban areas. In 1960, this number was just under 34%. The world's
            urban population is growing at an incredible rate, which is a result
            of rapid societal and economic growth. With urban growth also comes
            the responsibility for us to plan for growth, and provide the proper
            infrastructures to not only continue this urban development, but
            also take steps to prepare for the future and protect the earth from
            global warming. Through these visualizations, I hope you can gain a
            better understanding of urbanization and the incredible urban growth
            across the world since 1960, but also think critically about what
            this means for the earth, and possible ways to continue this growth
            while protecting the earth.
          </p>
        </div>
        <br></br>
        <br></br>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>Urban Population Percentage in {selectedYear}</h3>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <label>Enter a year between 1990 and 2017</label>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input type="text" id="selectedYear" name="selectedYear" />
          <button
            onClick={() => {
              let year = parseInt(
                document.getElementById("selectedYear").value
              );
              if (year >= 1990 && year <= 2017) {
                setSelectedYear(year);
              }
            }}
          >
            Set Year
          </button>
        </div>
        <br />
        <br />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <ReactTooltip
            id="countryTip"
            place="top"
            effect="solid"
            getContent={(dataTip) => `${dataTip}`}
          />

          <div style={{ display: "flex", justifyContent: "left" }}>
            <svg width={width} height={height}>
              <g>
                {countryShapes.map((shape, i) => {
                  return (
                    <path
                      data-tip={
                        shape.id +
                        ": " +
                        get_urban_pop_for_year(selectedYear)[shape.id] +
                        "%"
                      }
                      data-for="countryTip"
                      key={selectedYear * 100 + i}
                      onClick={() => {
                        //console.log(shape);
                        let year = selectedYear + 1;
                        year = year > 2017 ? 1990 : year;
                        setSelectedYear(year);
                      }}
                      d={path(shape)}
                      //fill={pct_to_rgb(urban_pop_1990[shape.id])}
                      fill={pct_to_rgb(
                        get_urban_pop_for_year(selectedYear)[shape.id]
                      )}
                      stroke="black"
                      strokeWidth={0.3}
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          <div style={{ display: "flex", justifyContent: "right" }}>
            <Legends />
          </div>
          <br></br>
        </div>
        <br></br>
        <br></br>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h4>Interactivity</h4>
        </div>
        <p>
          In order to navigate this visualization, we have implemented a few
          tools for interactivity. First off, you can HOVER over the countries
          and view their respective urban population percentages, as well as the
          country code. Additionally, you can manually ENTER a year between 1990
          and 2017 in the search bar, and the visualization will display the
          corresponding urban population percentages for that year across the
          world. When the year changes, the title will change accordingly as
          well to show the year for the corresponding data that you are seeing
          on the map. Lastly, you can also LEFT-CLICK on any country, and the
          year will advance forward. Doing this will allow you to move quickly
          through the years, and view the changes from year to year.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h4>Analysis</h4>
        </div>
        <p>
          This interactive visualization allows us to view the changes over time
          of the urban population across the world. Above the visualization, we
          can enter the year (between 1990-2017) that we wish to view, and as a
          result the visualization will render the world's urban population
          demographic for that given year. Using this interactive visualization,
          we are able to view the effects of urbanization, and see how the
          population changes from year to year. This visualization allows us to
          pick a year, and clearly see the changes in the urban population both
          in specific countries and across the world. Previously, I had two
          visualizations displaying the maps of the urban population percentage
          in 1990 and 2017, but that limited us as it we could only see the
          change over 27 years, but didn't allow us to fully visualize the
          actual growth and change from year to year. I chose to do this because
          it will not only help us views the changes in the urban population
          over time, but also help us build and better understand the effects of
          urbanization on the world as a whole.
        </p>

        <p>
          Alternatively, I considered implementing a slider tool that would
          allow us to slide instead of input the years, but I found that it
          would be difficult for a user to use the slider as it was hard to be
          precise for the year. Additionally, the map would not render
          instantly, so it was not offering a smooth transition when I
          interacted with the slider tool, and would end up being choppy. I also
          considered implementing a tool that was a drop down, but ultimately
          decided that the drop down was too clunky with so many years, and
          would be better if the user could select specific years by themselves
          by manually inputting the year, and then having the map render the
          corresponding data for that year.
        </p>

        <p>
          During the development process, I first wrote down a list of different
          interactive visualizations I could create, and ultimately decided that
          building an interactive map with colored labels would be the most
          effective way to see the changes in urban development, and how
          urbanization has impacted the world since 1960. I considered and
          experimented with different tools such as a slider, but ultimately
          decided that allowing a user to input their desired year to view was
          the most effective and smoothest interactive tool. I spent roughly 12
          hours developing this interactive visualization. The aspect that took
          the longest time was building out the interactivity, and ensuring that
          entering a new year would actually also have the visualization render
          the corresponding data for that year. Initially, a lot of time was
          spent debugging as I was able to properly test that the year and data
          were appropriate when entered in, but the map would not update or
          would render a map with every country being represented incorrectly.
        </p>
      </div>
    );
  };

  const xvalues = urban.data.map((row, i) => {
    return row.Year;
  });
  const yvalues_bar_chart = urban_total.data.map((row, i) => {
    return row.urban_pop_total / 1000000;
  });
  const yvalues_bar_chart2 = urban_pop_density.data.map((row, i) => {
    return row.pop_density;
  });

  const yvalues = urban.data.map((row, i) => {
    return row.urban_pop_pct;
  });
  const yvalues_agglom = urban_agglom.data.map((row, i) => {
    return row.urban_agglom_pct;
  });
  const yvalues_largest_city = urban_largest_city.data.map((row, i) => {
    return row.urban_pop_largest_city_pct;
  });

  const lineNames = [
    "Urban Population %",
    "Urban Agglomeration %",
    "Urban Population Largest City %",
  ];
  const lineChartData = [
    { name: lineNames[0], data: yvalues },
    { name: lineNames[1], data: yvalues_agglom },
    { name: lineNames[2], data: yvalues_largest_city },
  ];

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
      urbanMargin,
    ]);

  const _scaleY_bar = scaleLinear()
    .domain([0, d3.max(yvalues_bar_chart)])
    .range([urbanChartHeight - urbanMargin, urbanMargin]);

  const urbanBarHeightScale2 = scaleLinear()
    .domain([0, Math.max(0, d3.max(yvalues_bar_chart2))])
    .range([
      urbanChartHeight - urbanMargin - urbanAxisTextPadding,
      urbanMargin,
    ]);

  const _scaleY_bar2 = scaleLinear()
    .domain([0, d3.max(yvalues_bar_chart2)])
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

  const decades = xvalues.filter((x) => {
    return x % 10 == 0;
  });
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
      <Header />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h1>Exploring Urban Development from 1960-2019</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>By Jeff Tu</h3>
      </div>

      <br></br>

      <Maps />
      <br></br>
      <br></br>

      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>
            Development of the Urban Population from 1960-2019 (Average Urban
            Population)
          </h3>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={urbanChartWidth} height={urbanChartHeight}>
            {yvalues_bar_chart.map((y, i) => {
              return (
                <rect
                  data-tip={minYear + i + ": " + parseInt(y) + "%"}
                  data-for="countryTip"
                  strokeWidth={1}
                  stroke="rgb(0,0,0)"
                  key={minYear + i}
                  fill="blue"
                  x={urbanYearScale(minYear + i)}
                  y={urbanBarHeightScale(y)}
                  width={10}
                  height={urbanBarHeightScale(0) - urbanBarHeightScale(y)}
                />
              );
            })}
            <AxisLeft
              strokeWidth={0.5}
              left={urbanMargin}
              scale={urbanBarHeightScale}
              label={"Total Urban Population (by millions)"}
            />
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

        <p>
          This bar graph showing the development of the urban population from
          1960-2020 simply shows that average urban population has been
          increasing at a steady rate since 1960, which is expected as the total
          population has been growing during this time. However, when we look at
          the next graph, we see that the total urban population percentage has
          been increasing as well, which means that the average urban population
          has been increasing at a faster rate than the total population,
          signifying a greater and faster growth in urban population.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>
            Average Population Density (people per square kilometer of land
            area)
          </h3>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={urbanChartWidth} height={urbanChartHeight}>
            {yvalues_bar_chart2.map((y, i) => {
              return (
                <rect
                  data-tip={minYear + i + ": " + parseInt(y)}
                  data-for="countryTip"
                  strokeWidth={1}
                  stroke="rgb(0,0,0)"
                  key={minYear + i}
                  fill="blue"
                  x={urbanYearScale(minYear + i)}
                  y={urbanBarHeightScale2(y)}
                  width={10}
                  height={urbanBarHeightScale2(0) - urbanBarHeightScale2(y)}
                />
              );
            })}
            <AxisLeft
              strokeWidth={0.5}
              left={urbanMargin}
              scale={urbanBarHeightScale2}
              label={"Population Density (people per sq. km of land area)"}
            />
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

        <p>
          This bar graph shows the average population density by year for all of
          the countries across the world since 1960. The average population
          density has been increasing almost every year since 1960, which makes
          sense with the increased urban development and a steady growth in
          urban population since 1960 as well that we can see when referencing
          the previous visualization. This steady increase in average population
          density makes sense with the increasing urban population, because as
          more urban infrastructure and housing is built, the number of people
          who live in these communities will increase. Additionally, with
          population naturally increasing-both in total and urban population-
          it's expected that the average population density would increase over
          time as well, given that the amount of land in the world is the same,
          the people per sq km of land area should naturally increase as well.
          This is important because it highlights the importance of
          urbanization, because building more housing and economic growth means
          more jobs and more places for people to live in these urban areas,
          which is where the greatest area of population growth comes from.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <br></br>
          <br></br>
          <br></br>

          <h3>Urban Population Growth from 1960-2020 </h3>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {lineNames.map((lineType, i) => {
            return (
              <>
                <input
                  key={i}
                  type="checkbox"
                  id={"line" + i}
                  name={"line" + i}
                  checked={selectedLines[i]}
                  onChange={(e) => {
                    selectedLines[i] = !selectedLines[i];
                    setSelectedLines([...selectedLines]);
                  }}
                />
                <label style={{ marginRight: 15 }}>{lineType}</label>
              </>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg width={chartSize + legendPadding} height={chartSize} key={"a"}>
            <AxisLeft
              strokeWidth={0.5}
              left={margin}
              scale={_scaleY}
              label={"Population Percentage out of Total Population"}
            />
            <AxisBottom
              strokeWidth={0.5}
              top={chartSize - margin}
              left={margin}
              scale={_scaleDate}
              tickValues={decades}
              label={"Year"}
            />

            {lineChartData.map((data, i) => {
              if (selectedLines[i]) {
                return (
                  <path
                    stroke={
                      i === 0
                        ? "rgba(0,0,255,1)"
                        : i === 1
                        ? "rgba(255, 0, 0, 1)"
                        : "rgba(0, 255, 0, 1)"
                    }
                    strokeWidth={1}
                    fill={"none"}
                    key={data["name"] + "line"}
                    d={_lineMaker(data["data"])}
                  />
                );
              }
            })}
            {lineChartData.map((data, i) => {
              if (selectedLines[i]) {
                return (
                  <text
                    fill={"black"}
                    style={{
                      fontSize: 10,
                      fontWeight: 300,
                    }}
                    key={data["name"] + "label"}
                    x={chartSize - margin + 5}
                    y={_scaleY(data["data"][data["data"].length - 1])}
                  >
                    {data["name"]}
                  </text>
                );
              }
            })}
          </svg>
        </div>

        <p>
          When we look at this graph, we can clearly see that the urban
          population percentage from 1960-2020 was increasing at a steady rate.
          Meanwhile, the urban population percentage in each country's largest
          city maintained a pretty steady percentage from 1960 to 2020, with
          only a slight decrease. This may be an indicator that although urban
          population in the largest city is decreasing, urban population
          percentage as a whole was steadily increasing during this time which
          may show that urban areas did not develop as fast, and the population
          in these urban areas was actually increasing. This may indicate a
          difference in development between urban areas and rural areas over
          this time. Additionally, when we observe urban agglomeration
          percentage over this time, we can clearly see that the urban
          agglomeration percentage is steadily increasing, just like the total
          urban population percentage. What does this indicate? Well, this shows
          that as the urban population increases, increasing agglomeration
          percentages indicate that urban built-up areas are also increasing.
          This further proves our analysis that urban population percentages in
          the main city may not be increasing, but the other cities in a country
          have increasing urban populations, as the areas surrounding cities are
          become increasingly populated.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <br></br>
          <br></br>
          <br></br>

          <h3>Pollution Percentage Levels in 1990 (by country)</h3>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
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
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>Pollution Percentage Levels in 2017 (by country)</h3>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
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

        <br></br>
        <br></br>
      </div>

      <p>
        When we observe our strip plots for pollution percentage levels in 1990
        versus pollution percentage levels in 2017, we can see that pollution
        was a major problem in 1990, and continues to be a major problem in
        2017. According to the World Health Organization (WHO), air pollution
        kills an estimated seven million people worldwide every year, and almost
        the entire global population breathes air that exceed WHO guideline
        limits containing "high levels of pollutants, with low and midddle
        income countries suffering from the highest exposures" (WHO). Our strip
        plots both indicate that when we group by country and observe pollution
        percentage levels, we see that most countries have near 100% pollution
        levels, which matches the WHO data. This is important because when we
        study urban development, we also have to keep in mind that pollution is
        a major factor that affects not only people in those major cities, but
        also people in urban areas and the entire global population as a whole.
      </p>

      <p>
        How can we find a good balance between rapid urban development while
        preventing pollution and using sustainable resources? As we can see from
        our visualizations, the world is experiencing rapid urbanization, which
        means widespread gentrification of areas surrounding cities and
        strengthened economies. But what is the cost? With increased economic
        growth comes the desire to continue building and developing new
        infrastructures, which means increased demand for supplies and
        production of goods. This production comes as a cost, as greenhouse gas
        emission comes from burning fossil fuels for electricity, heat, and
        transportation which are all things that increase in demand with
        increased urban growth. How do we move towards finding more sustainable
        solutions?
      </p>

      <br></br>
      <br></br>
      <br></br>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <h3>Understanding Urban Development</h3>
      </div>

      <p>
        When I selected this dataset, I seeked away to understand and answer 3
        main questions. The first question is: "What has urban development
        looked like over the past 60 years?" When I first looked at the data, it
        became apparent that one of the best ways to understand urban
        development was looking at how the average urban population had changed
        over this period of time. Through our visualizations, we can clearly
        observe that the urban population has not only been increasing at a
        steady rate, but also at a rate faster than the growth of the total
        population. Using our visualizations for urban population percentage and
        total urban population, we can understand that although the average
        urban population has been increasing at a steady rate (from
        approximately 7 million to over 25 million on average per country),
        which is a much faster rate of increase than the total average worldwide
        population.{" "}
      </p>
      <br></br>

      <p>
        Additionally, I also looked to answer the question of "How does urban
        development look across the entire world?" Through our map
        visualization, we can clearly see the effect of urbanization across the
        world, as many countries have experienced increased urban growth over
        this time. As we can clearly see from our maps, regions across the
        entire world are experiencing more urbanization, as their urban
        population percentages are increasing. This means that the urban
        populations in these countries are growing at a faster rate than their
        total population, which also explains the steady increase in urban
        agglomeration.
      </p>
      <br></br>

      <p>
        Another question I seeked to answer was also linked to urbanization and
        pollution, which is "How has urbanization affected pollution across the
        world from 1990 to 2017?" With urbanization comes economic growth which
        may come in the form of factories and industries that require
        unsustainable resources, causing an increase in pollution. However,
        through our strip plots we can understand that since 1960, there has not
        been much growth or developments in reducing pollution, as nearly 100%
        of the countries across the world are feeling the effects of pollution.
        Urbanization may be detrimental in reducing pollution because with
        industrial and economic growth comes the need for these resources and
        factories that produce harmful gases and other biproducts that do not
        help with reducing pollution. Pollution is an issue that likely needs to
        be addressed, as global warming and other environmentally related issues
        are at the forefront of our minds. How can we find a balance between
        urbanization and industrial growth, while also helping with reducing
        pollution?
      </p>
      <br></br>

      <p>
        In conclusion, we can see that the urban population has continued to
        grow at a rate greater than the rate of growth for the total population.
        This may be due to a variety of factors that cause urbanization. It's
        important to pay more attention to urban development and growth because
        the urban population makes up for over half of the worldwide population,
        and has a great effect on economic growth. Urbanization can solve
        problems related to population congestion, deficiencies in
        infrastructure and housing conditions, as well as many other problems.
        Growth in these areas make room for employment opportunities and
        improved infrastructure and living conditions for these people. The
        biggest takeaway from this project was understanding the impact of urban
        development, and how urbanization has affected the world from 1960-2020.
        We can clearly see that urbanization is a crucial element of growth
        across the world, and the ways in which it affects the overall
        population as well as the populations in different countries and
        regions. I learned the importance of working with complete datasets, and
        how to wrangle data in a way that helps us produce better, more
        impactful visualizations. I also learned how different interactive
        visualizations can portray different ideas and show overall patterns and
        different analyses across our data.
      </p>
      <br></br>
      <br></br>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>Thank You!</h2>
      </div>
      <br></br>
      <br></br>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <a class="mailto" href="mailto:jefftu@uw.edu">
          Feel free to email me with any feedback or inquiries!
        </a>
      </div>
    </div>
  );
}
export default App;
