import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

// REPLACE THIS WITH YOUR DEPLOYED GOOGLE APPS SCRIPT WEB APP URL
const APPS_SCRIPT_URL = 'YOUR-GAS-WEB-APP-URL-HERE'; 

const DomainTreemapWidget = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const svgRef = useRef();
    const width = 600; // Adjust based on your CSS layout
    const height = 400; // Adjust based on your CSS layout

    // Fetch data securely from Apps Script on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${APPS_SCRIPT_URL}?endpoint=treemapData`);
                const result = await response.json();
                if (result.success) {
                    setData(result.data);
                } else {
                    console.error("API error:", result.error);
                }
            } catch (error) {
                console.error("Network or script URL error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // D3 rendering logic
    useEffect(() => {
        if (!data || loading) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous render

        const root = d3.hierarchy(data).sum(d => d.value);

        d3.treemap()
            .size([width, height])
            .paddingInner(1)
            (root);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const cell = svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        cell.append("rect")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", d => color(d.parent.data.name)); // Uses parent color for consistency

        cell.append("text")
            .attr("x", 4)
            .attr("y", 14)
            .attr("fill", "white")
            .style("font-size", "11px")
            .text(d => d.data.name);

        cell.append("text")
            .attr("x", 4)
            .attr("y", 28)
            .attr("fill", "white")
            .style("font-size", "10px")
            .text(d => `${d.data.value} links`);
            
    }, [data, loading]);

    if (loading) return <div>Loading Domain Treemap...</div>;
    if (!data) return <div>Failed to load data.</div>;

    return (
        <div /* Apply 'Widget' styling here */ >
            <h3>Top Shortened Domains Treemap</h3>
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    );
};

export default DomainTreemapWidget;
