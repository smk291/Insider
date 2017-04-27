  //<editor-fold import
import React                                from 'react'
import chartscss from './chartscss'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.drawD3Bar = this.drawD3Bar.bind(this);
    // this.drawChart = this.drawChart.bind(this);
    this.drawD3BarSvg = this.drawD3BarSvg.bind(this);
    this.state = {
      d3prevRect: <p></p>
    }
  }

  drawD3Bar(el, props, state) {
    const now1 = Date.now();

    var x = d3.scaleLinear()
      .domain([0, Math.max.apply(Math, this.props.listings.map(function(el) {return el.price}))])
      .range([0, 420]);

      d3.select(el)
        .selectAll("div")
          .data(this.props.listings)
        .enter().append("div")
          .style("background-color", "steelblue")
          .style("height", "1px")
          .style("margin", "10px")
          .style("width", function(d) { return x(d.price) + "px"; })  

    let d3Color = d3.transition()
      .duration(1000)
      .ease(d3.easeExpOut);

    d3.select(el)
      .selectAll("div")
      .on("mouseover", function () {
         return d3.select(this)
          .transition(d3Color)
          .style("background-color", "red")
          .style("height", "20px");
      })
      .on("mouseout", function() {
        return d3.select(this)
          .transition(d3Color)
          .style("background-color", "steelblue")
          .style("height", "1px");
      })


    console.log("Say hello!");
    const now2 = Date.now();
    console.log(`div: ${now2 - now1}`);
  }


  drawD3BarSvg(el, props, state) {
    const now1 = Date.now();

    var width = 420,
        barHeight = 10;

    var x = d3.scaleLinear()
        .domain([0, Math.max.apply(Math, this.props.listings.map(function(el) {return el.price}))])
        .range([0, width]);

    var chart = d3.select(el)
        .attr("width", width + "px")
        .attr("height", barHeight * this.props.listings.length + "px");

    var bar = chart.selectAll("g")
        .data(this.props.listings)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d, i) { return x(d.price) + "px"})
        .attr("id", function(d, i) {return i})
        .attr("height", barHeight + "px");

    let d3Color = d3.transition()
      .duration(1000)
      .ease(d3.easeExpOut);

    d3.select(el)
      .selectAll("rect")
    //   .on("mouseover", function () {
    //     d3.select(this)
    //       .transition(d3Color)
    //       .style("fill", "red")
    //       .style("height", "20px");
    //   })
      .on("mouseout", function() {
        try {
          d3.select(this)
            .transition(d3Color)
            .style("fill", "steelblue")
            .style("height", "10px");
        } catch (e) {
          error: e;
        }
      })
                                // .transition()
                                // .duration(500)
                                // .on("mouseover", function() {
                                //   d3.active(this).style("fill", "red");
                                // })

                              // bar.append("text")
                                  // .attr("x", function(d) { return x(d) - 3; })
                                  // .attr("y", barHeight)
                                  // .attr("dy", ".35em")
                                  // .text(function(d) { return d; });

    const now2 = Date.now();

    document.getElementsByClassName("chartSvg")[0].addEventListener("mouseenter", (e) => {
      if (e.target && e.target.nodeName === "rect") {
        d3.select(e.target)
          .style("fill", "black");

        this.setState({d3prevRect: e.target});
      }
    });

    document.getElementsByClassName("chartSvg")[0].addEventListener("click", (e) => {
      console.log(e.target);
      console.log(this.state.d3prevRect);
    })

    console.log(`svg: ${now2 - now1}`);
  }

  // drawChart() {
  //   var data = new google.visualization.DataTable();
  //   data.addColumn('string', 'Topping');
  //   data.addColumn('number', 'Slices');
  //   data.addRows([
  //     ['Mushrooms', 3],
  //     ['Onions', 1],
  //     ['Olives', 1],
  //     ['Zucchini', 1],
  //     ['Pepperoni', 2]
  //   ]);

  //   // Set chart options
  //   var options = {'title':'How Much Pizza I Ate Last Night',
  //                  'width':400,
  //                  'height':300};

  //   // Instantiate and draw our chart, passing in some options.
  //   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  //   chart.draw(data, options);
  // }



  componentDidMount() {
    // google.charts.load('current', {'packages':['corechart']});

    // // Set a callback to run when the Google Visualization API is loaded.
    // google.charts.setOnLoadCallback(this.drawChart);

    // this.drawChart()
          // .text(function(d) { return "$ " + d.price; });

    this.drawD3Bar(".chart", this.props, this.state);
    this.drawD3BarSvg(".chartSvg", this.props, this.state);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.listings != nextProps.listings;
  }

  componentDidUpdate() {
    this.drawD3Bar(".chart", this.props, this.state);
    this.drawD3BarSvg(".chartSvg", this.props, this.state);
  }

  // componentWillUnmount() {
  //   d3.select(".chart")
  //     .selectAll("div")
  //     .enter()
  //     .remove()
  // }

  render() {
    return (
      <div>
        <div>
          <p>Hi!</p>
          <div id='chart_div'></div>
        </div>

        <div ref="d3PriceBar" className="chart"></div>
        <p>Hiya!</p>
        <svg className="chartSvg">{this.props.children}</svg>
      </div>
    );
  }
}


Charts.propTypes = {
  d3prevRect: PropTypes.node
}




//===========================================================================//

// var d3Chart = {};

// d3Chart.create = function(el, props, state) {
//   var svg = d3.select(el).append('svg')
//       .attr('class', 'd3')
//       .attr('width', props.width)
//       .attr('height', props.height);

//   svg.append('g')
//       .attr('class', 'd3-points');

//   this.update(el, state);
// };

// d3Chart.update = function(el, state) {
//   // Re-compute the scales, and render the data points
//   var scales = this._scales(el, state.domain);
//   this._drawPoints(el, scales, state.data);
// };

// d3Chart.destroy = function(el) {
//   // Any clean-up would go here
//   // in this example there is nothing to do
// };

// d3Chart._drawPoints = function(el, scales, data) {
//   var g = d3.select(el).selectAll('.d3-points');

//   var point = g.selectAll('.d3-point')
//     .data(data, function(d) { return d.id; });

//   // ENTER
//   point.enter().append('circle')
//       .attr('class', 'd3-point');

//   // ENTER & UPDATE
//   point.attr('cx', function(d) { return scales.x(d.x); })
//       .attr('cy', function(d) { return scales.y(d.y); })
//       .attr('r', function(d) { return scales.z(d.z); });

//   // EXIT
//   point.exit()
//       .remove();
// };

// var sampleData = [
//   {id: '5fbmzmtc', x: 7, y: 41, z: 6},
//   {id: 's4f8phwm', x: 11, y: 45, z: 9},
//   // ...
// ];

// var Chart = React.createClass({
//   propTypes: {
//     data: React.PropTypes.array,
//     domain: React.PropTypes.object
//   },

//   componentDidMount: function() {
//     var el = ReactDOM.findDOMNode(this);
//     d3Chart.create(el, {
//       width: '100%',
//       height: '300px'
//     }, this.getChartState());
//   },

  // componentDidUpdate: function() {
  //   var el = ReactDOM.findDOMNode(this);
  //   d3Chart.update(el, this.getChartState());
  // },

  // getChartState: function() {
  //   return {
  //     data: this.props.data,
  //     domain: this.props.domain
  //   };
  // },

  // componentWillUnmount: function() {
  //   var el = ReactDOM.findDOMNode(this);
  //   d3Chart.destroy(el);
  // },

//   render: function() {
//     return (
//       <div className="Chart"></div>
//     );
//   }
// });