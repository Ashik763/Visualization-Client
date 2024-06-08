import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './PieChartInPercentage.css';
import Dropdown from '../Dropdown/Dropdown';

const PieChartInPercentage = () => {
  const [data, setData] = useState([]);
  const [dropdownValue, setDropdownValue] = useState("country");
  const svgRef = useRef();
  const [centerText, setCenterText] = useState({ id: `Represents which ${dropdownValue} has the most focus in the dataset`, percentage: '' });

  useEffect(() => {

    fetch(`http://localhost:5000/pie-chart-percentage/${dropdownValue}`)
      .then(res => res.json())
      .then(data => {
        let total = data.reduce((prev, curr) => {
          return prev + curr.total;
        }, 0);

        let result = data.map((d) => {
          return {
            ...d,
            percentage: Math.round((d.total / total) * 100),
            percentageRounded: Math.round((d.total / total) * 100)
          };
        });

        let finalResult = [];
        for (let i = 0; i <= 1; i++) {
          finalResult.push(result[i]);
        }
        finalResult.push({
          percentage: Math.round(100 - (result[0].percentage + result[1].percentage)),
          percentageRounded: Math.round(100 - (result[0].percentage + result[1].percentage)),
          _id: "Others",
          total: total - (result[0].total + result[1].total)
        });

        setCenterText({ id: `Represents which ${dropdownValue} has the most focus in the dataset`, percentage: '' });
        setData(finalResult);

      });
  }, [dropdownValue]);

  useEffect(() => {
    const width = 500;
    const height = 500;
    const radius = Math.min(width, height) / 2;

   
    d3.select(svgRef.current).selectAll('*').remove();
    

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const color = d3.scaleOrdinal()
      .domain(data.map(d => d._id))
      .range(d3.schemeCategory10);

    const pie = d3.pie()
      .value(d => d.percentageRounded)
      .sort(null);

    const arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70)
      .cornerRadius(10)
      .padAngle(0.03);

    const arcHover = d3.arc()
      .outerRadius(radius)
      .innerRadius(radius - 70)
      .cornerRadius(10)
      .padAngle(0.03);

    const g = svg.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', arc)
      .style('fill', d => color(d.data._id))
      .on('mouseover', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover);

        setCenterText({ id: d.data._id, percentage: d.data.percentage });
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc);

        setCenterText({ id: `Represents which ${dropdownValue} has the most focus in the dataset`, percentage: '' });
      });

    g.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('dy', '.35em')
      .attr('fill', 'black')
      .attr('font-size', '14px')
      .attr('text-anchor', 'middle')
      .text(d => `${d.data._id === "" ? "Unknown" : d?.data?._id}: ${d?.data?.percentageRounded}%`);
  }, [data, dropdownValue]);

  return (
    <div className="chart-container w-full">
       <p className=" text-center text-3xl text[#5eead4] m-3">
          Pie Chart <br />
        
        
          <span className="text-xs" style={{ fontStyle: "italic" }}>
            {" "}
            Hover on the section to see details
          </span>
        </p>
      <div className=' flex justify-center'>
        <div >
      <Dropdown setDropdownValue={setDropdownValue}></Dropdown>
      <svg id="mySVG" ref={svgRef}></svg>
      <div className="center-text mt-20  max-w-48 ">
        <p className='text-xs'><small className='p-2'>{centerText.id || "Unknown"}</small></p>
        {centerText.id[0] !== 'R' && <p className='text-xs '>{centerText.percentage || ''}%</p>}
      </div>
      </div>
      </div>
    </div>
  );
};

export default PieChartInPercentage;
