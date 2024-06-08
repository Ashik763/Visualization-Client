import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './SectorIntensity.css'; // Import the CSS file

const SectorIntensity = () => {
  const svgRef = useRef();
  const [selectedKeys, setSelectedKeys] = useState(['avgIntensity', 'avgLikelihood', 'avgRelevance']);
  const [data, setData] = useState([]);

  useEffect(()=> {
    fetch('https://visualization-rho.vercel.app/sector-intensity')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setData(data);
    })
  },[])

  useEffect(() => {
    const margin = { top: 20, right: 30, bottom: 80, left: 40 };
    const width = data?.length * 30 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right + 100)
      .attr('height', height + margin.top + margin.bottom + 100);

    svg.selectAll("*").remove();

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d._id))
      .range([0, width ])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => selectedKeys.reduce((sum, key) => sum + d[key], 0))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(selectedKeys)
      .range(['#826af9', '#d2b0ff', '#f8d3ff']);

    const stack = d3.stack()
      .keys(selectedKeys);

    const layers = stack(data);

    const tooltip = d3.select('.tooltip');

    // Function to create grid lines
    const createGrid = () => {
      const gridX = d3.axisBottom(x)
        .tickSize(-height)
        .tickFormat('');

      const gridY = d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat('');

      chart.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(gridX);

      chart.append('g')
        .attr('class', 'grid')
        .call(gridY);
    };

    createGrid(); // Call the function to create the grid

    chart.append('g')
      .selectAll('g')
      .data(layers)
      .enter().append('g')
      .attr('fill', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data._id))
      .attr('y', height)
      .attr('height', 0)
      .attr('width', x.bandwidth())
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`Category: ${d?.data?._id}<br>${d?.key?.replace('avg', '')}: ${d?.data[d?.key]}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .transition()
      .duration(750)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]));

    chart.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(30)")
      .attr("y", 5)
      .attr("x", 0)
      .attr("dy", ".35em")
      .style("text-anchor", "start");

    chart.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    const legend = chart.append('g')
      .attr('transform', `translate(${width - 100}, 0)`);

    selectedKeys.forEach((key, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(key));

      legendRow.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .style('text-transform', 'capitalize')
        .text(key.replace('avg', ''));
    });
  }, [selectedKeys, data]);

  const handleCheckboxChange = (key) => {
    setSelectedKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div >
      {data?.length === 0 ? "Loading..." : 
        <div className=' flex justify-center'>
          <div className=''>
            <p className=' text-center text-3xl text[#5eead4] m-3'>
              Intensity Graph <br/>
              <span className='text-xs'>The average intensity, likelihood, relevance of each sector.</span>
            </p>    
            <div className="checkboxes">
              <label>
                <input type="checkbox" checked={selectedKeys.includes('avgIntensity')} onChange={() => handleCheckboxChange('avgIntensity')} />
                Intensity
              </label>
              <label>
                <input type="checkbox" checked={selectedKeys.includes('avgLikelihood')} onChange={() => handleCheckboxChange('avgLikelihood')} />
                Likelihood
              </label>
              <label>
                <input type="checkbox" checked={selectedKeys.includes('avgRelevance')} onChange={() => handleCheckboxChange('avgRelevance')} />
                Relevance
              </label>
            </div>
            <svg
            //  style={{ border: '1px solid red' }}
              ref={svgRef}></svg>
            <div className="tooltip ms-10"></div>
          </div>
        </div>
      }
    </div>
  );
};

export default SectorIntensity;
