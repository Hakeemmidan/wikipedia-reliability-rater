import React from 'react';
import * as d3 from 'd3';
import {visitPage} from '../../../utils/articles_util';

let cheerio = require('cheerio');

// Inspired by : https://www.d3-graph-gallery.com/graph/donut_basic.html
// https://medium.com/@kj_schmidt/show-data-on-mouse-over-with-d3-js-3bf598ff8fc2
export class DonutGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {'loading...': 10, 'please...': 10, 'wait...': 10},
      margin: 40,
      width: 600,
      height: 350,
    };
    this.topTenAuthorContributionPercentage = this.topTenAuthorContributionPercentage.bind(
      this
    );
    this.drawChart = this.drawChart.bind(this);
  }

  async componentDidMount() {
    this.topTenAuthorContributionPercentage();
    this.drawChart();
  }

  topTenAuthorContributionPercentage = () => {
    // We are going to store top ten authors and their contributions here
    let topTenAuthors = {};

    // 3. Load it in the xtools wikipedia authorship statistics page
    visitPage(
      'https://xtools.wmflabs.org/authorship/en.wikipedia.org/' +
        this.props.articleTitle
    )
      .then((res) => {
        const $2 = cheerio.load(res.body);

        const authorsUsernames = $2(
          'table.authorship-table td.sort-entry--username'
        )
          .slice(0, 10)
          .map(function () {
            return $2(this).attr('data-value');
          })
          .get();

        const authorsContributionPercentage = $2(
          'table.authorship-table td.sort-entry--percentage'
        )
          .slice(0, 10)
          .map(function () {
            return $2(this).attr('data-value');
          })
          .get();

        authorsUsernames.forEach(
          (author, idx) =>
            (topTenAuthors[author] = authorsContributionPercentage[idx])
        );

        return topTenAuthors;
      })
      .then((topTenAuthors) => {
        let remainingPercentage =
          100 -
          Object.values(topTenAuthors).reduce(
            (accum, el) => Number(accum) + Number(el)
          );
        topTenAuthors = Object.assign(topTenAuthors, {
          others: remainingPercentage.toFixed(2),
        });
        this.setState({
          data: topTenAuthors,
        });
        this.props.extractTop10AuthorsUsernames(
          Object.keys(this.state.data).slice(
            0,
            Object.keys(this.state.data).length - 1
          )
        );
      })
      .catch((err) => {
        throw err;
      });
  };

  drawChart() {
    d3.select('#donut_graph_div').html('');
    const radius =
      Math.min(this.state.width, this.state.height) / 2 - this.state.margin;
    let svg = d3
      .select('#donut_graph_div')
      .append('svg')
      .attr('class', 'article-show-donut-graph')
      .attr('width', this.state.width)
      .attr('height', this.state.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.state.width / 2 + ',' + this.state.height / 2 + ')'
      );

    let color = d3
      .scaleOrdinal()
      .domain(this.state.data)
      .range([
        'violet',
        'indigo',
        'skyblue',
        'blue',
        'green',
        'lightgreen',
        'yellow',
        'orange',
        'red',
        'lightred',
        'lightBlue',
      ]);

    let pie = d3.pie().value(function (d) {
      return d.value;
    });
    let data_ready = pie(d3.entries(this.state.data));

    // Add div to body isn't visible.
    // This will be the box that appears next to mouse on hover.
    let div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip-donut')
      .style('opacity', 0);

    svg
      .selectAll('path')
      .attr('class', 'donut-graph-svg')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(70).outerRadius(radius))
      .attr('fill', function (d) {
        return color(d.data.key);
      })
      .attr('stroke', 'ghostwhite')
      .style('stroke-width', '1px')
      .attr('opacity', 1)
      .attr(
        'transform',
        'translate(' +
          -this.state.width / 9 +
          ',' +
          -this.state.height / 100 +
          ')'
      )

      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('200').attr('opacity', '0.5');
        div.transition().duration(300).style('opacity', 1);
        // vvv This shows value of arc on mouseover
        div
          .html(`${d.data.key}: ${d.value}%`)
          .style('left', d3.event.pageX + 15 + 'px')
          .style('top', d3.event.pageY - 20 + 'px');
      })

      .on('mouseout', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1');
        div.transition().duration(50).style('opacity', 0);
      });

    // Legend styling inspired by : https://medium.com/@kj_schmidt/making-an-animated-donut-chart-with-d3-js-17751fde4679
    // vvvvvvvvvvvvv
    let legendRectSize = 15;
    let legendSpacing = 9;

    let legend = svg
      .selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'circle-legend')
      .attr('transform', function (d, i) {
        let height = legendRectSize + legendSpacing;
        let offset = (height * color.domain().length) / 2;
        let horz = 15 * legendRectSize - 13;
        let vert = i * height - offset;
        return 'translate(' + horz / 2 + ',' + vert + ')';
      });

    legend
      .append('circle') //keys
      .style('fill', color)
      .style('stroke', color)
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', '.4rem');
    legend
      .append('text') //labels
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .attr('font-size', 20)
      .style('fill', 'white')
      .text(function (d) {
        return d;
      });
    // ^^^^^^^^^^^
  }

  render() {
    this.drawChart();
    return (
      <div className="donut-graph-container">
        <p>Top 10 Author Percentage Contribution (+ Others)</p>
        <div id="donut_graph_div"></div>
      </div>
    );
  }
}
