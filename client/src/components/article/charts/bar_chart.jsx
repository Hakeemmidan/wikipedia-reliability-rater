import React, { Component } from 'react'
import * as d3 from 'd3';

export class BarChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{ lang: 'swift', value: 1 }, { lang: 'python', value: 2 }, { lang: 'js', value: 5 }]
        }

        this.executeD3 = this.executeD3.bind(this)
    }

    componentDidMount() {
        this.executeD3()
    }

    executeD3() {
        const margin = 60;
        const chartWidth = 1000 - 2 * margin
        const chartHeight = 600 - 2 * margin

        const svg = d3.select('svg')
                      .style("background-color", 'pink')
                      .attr('width', chartWidth)
                      .attr('height', chartHeight)

        const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)

        const yScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, 100])
        chart.append('g')
            .attr('transform', `translate(0, ${-100})`)
            .call(d3.axisLeft(yScale))

        const xScale = d3.scaleBand()
            .range([0, chartWidth])
            .domain(this.state.data.map(d => d.lang))
            .padding(0.2)
        chart.append('g')
            .attr('transform', `translate(0, ${chartHeight - 100})`)
            .call(d3.axisBottom(xScale))
    }

    render() {
        return (
            <div>
                <h2>This is a basic bar chart</h2>
                <svg>
                </svg>
            </div>
        )
    }
}