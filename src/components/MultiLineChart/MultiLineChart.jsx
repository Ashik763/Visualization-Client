import React, { useRef, useEffect, useState } from "react";
import { DatePicker, Select, Space } from "antd";
import * as d3 from "d3";
import "./MultiLineChart.css";
import SelectSectors from "../SelectSectors/SelectSectors";

const MultiLineChart = () => {
  const [data, setData] = useState([]);
  const [startYear, setStartYear] = useState("2016");
  const [endYear, setEndYear] = useState("2016");
  const [dropdownValue, setDropdownValue] = useState("Energy");

  const onChangeStartYear = (date, dateString) => {
    setStartYear(dateString);
    setEndYear(dateString);
  };

  const handleChange = (value) => {
    console.log(value);
    setDropdownValue(value.value);
  };

  const onChangeEndYear = (date, dateString) => {
    console.log(typeof dateString);
    setEndYear(dateString);
  };

  useEffect(() => {
    fetch(
      `http://localhost:5000/insights-trends/?startYear=${startYear}&endYear=${endYear}&sector=${dropdownValue}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, [startYear, endYear, dropdownValue]);

  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll("*").remove();
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("display", "none")
      .style("pointer-events", "none");

    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach((d) => {
      d.date = parseDate(d.date);
    });

    const topics = Array.from(
      new Set(data.flatMap((d) => Object.keys(d.topics)))
    );

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d3.max(Object.values(d.topics)))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10).domain(topics);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    const yAxis = svg.append("g").call(d3.axisLeft(y));

    const topicLines = topics.map((topic) => {
      return {
        topic: topic,
        values: data.map((d) => {
          return {
            date: d.date,
            value: d.topics[topic] || 0,
          };
        }),
      };
    });

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    const path = svg
      .selectAll(".line")
      .data(topicLines)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("d", (d) => line(d.values))
      .attr("stroke", (d) => color(d.topic))
      .attr("stroke-width", 2)
      .attr("fill", "none");

    const dots = svg
      .selectAll(".dot")
      .data(
        data.flatMap((d) =>
          topics.map((topic) => ({
            date: d.date,
            topic: topic,
            value: d.topics[topic] || 0,
          }))
        )
      )
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", 4)
      .attr("fill", (d) => color(d.topic))
      .on("mouseover", (event, d) => {
        tooltip
          .style("display", "block")
          .html(
            `Date: ${d3.timeFormat("%Y-%m-%d")(d.date)}<br>Topic: ${
              d.topic
            }<br>Value: ${d.value}`
          );
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 15 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("display", "none");
      });

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .translateExtent([
        [-width, -Infinity],
        [2 * width, Infinity],
      ])
      .on("zoom", (event) => {
        const newX = event.transform.rescaleX(x);
        const newY = event.transform.rescaleY(y);

        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));

        path.attr("d", (d) => line.x((d) => newX(d.date))(d.values));
        dots.attr("cx", (d) => newX(d.date)).attr("cy", (d) => newY(d.value));
      });

    svg.call(zoom);
  }, [data]);

  return (
    <div className=" mt-2 flex justify-center ">
      <div>
        <p className=" text-center text-3xl text[#5eead4] m-3">
          Multi Line Chart <br />
          <span className="text-xs">
            {" "}
            Tracks how the number of insights for each topic within a sector has
            changed over time.
          </span>{" "}
          <br />
          <span className="text-xs" style={{ fontStyle: "italic" }}>
            {" "}
            Double tap on the point to Zoom in{" "}
          </span>
        </p>
        Start Year:{" "}
        <Space direction="vertical">
          <DatePicker
            placeholder={startYear}
            onChange={onChangeStartYear}
            picker="year"
          />
        </Space>{" "}
        End Year:{" "}
        <Space direction="vertical">
          <DatePicker
            placeholder={endYear}
            onChange={onChangeEndYear}
            picker="year"
          />
        </Space>
        <SelectSectors handleChange={handleChange}> </SelectSectors>
        <div style={{ overflowX: "scroll" }}>
          <svg ref={svgRef}></svg>
          <div ref={tooltipRef}></div>

          {/* <div className="mt-5">
            <p>
              <small style={{ color: "C9CCCC" }} className="">
                {" "}
                Tracks how the number of insights for each topic within a sector
                has changed over time
                <br />
                <span style={{ fontStyle: "italic" }}>
                  {" "}
                  Double on the point to Zoom in{" "}
                </span>
              </small>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default MultiLineChart;
