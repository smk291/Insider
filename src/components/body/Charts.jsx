  //<editor-fold import
import React                                from 'react'
import chartscss from './chartscss'
import ReactDOM from 'react-dom'

export default class Charts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.drawD3Bar = this.drawD3Bar.bind(this);
    // this.drawChart = this.drawChart.bind(this);
    this.drawD3BarSvg = this.drawD3BarSvg.bind(this);
  }

  drawD3Bar(el, props, state) {
    const now1 = Date.now();

    var x = d3.scaleLinear()
      .domain([0, Math.max.apply(Math, this.props.listings.map(function(el) {return el.price}))])
      .range([0, 420]);

    d3.select(el).selectAll("div")
      .data(this.props.listings)
      .enter().append("div")
      .each(function(d) {
        d3.select(this).append("div")
      });

    d3.select(el).selectAll("div.chart > div")
      .classed("barContainer", true)
      .style("height", "60px")
      .style("width", "420px")
      .style("display", "flex")
      .style("align-items", "center")
      .style("position", "relative");

    d3.select(el).selectAll("div.chart > div > div")
      .classed("bar", true)
      .style("background-color", "steelblue")
      .style("height", "40px")
      .style("position", "relative")
      .style("box-shadow", "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)")
      .style("width", function(d) { return x(d.price) + "px";});

    // let circleIn = d3.transition()
    //   .ease(d3.easeCircleIn);

    // let circleOut = d3.transition()
    //   .ease(d3.easeCircleOut);

    d3.select(el)
      .selectAll(".bar")
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .duration(100)
          // .style("background-color", "red")
          // .style("height", "20px");
          .style("background-color", "#2a4e6c")
          .style("height", "70px")
          .style("right", "15px")
          .styleTween("box-shadow", function() {
              var i = d3.interpolate("0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
              return function(t) {
                  return i(t);
              }
          })
          .style("width", function(d) { return (x(d.price) + 30) + "px";});
      })
      .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(100)
            // .style("background-color", "steelblue")
            // .style("height", "10px");
            .style("background-color", "steelblue")
            .styleTween("box-shadow", function() {
                var i = d3.interpolate("0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)");
                return function(t) {
                    return i(t);
                }
            })
            .style("width", function(d) { return x(d.price) + "px";})
            .style("height", "40px")
            .style("right", "0px")
      })

    // document.getElementsByClassName("chart")[0].addEventListener("mouseover", (e) => {
    //     if (e.target && e.target.className === "bar"){
    //       d3.select(e.target)
    //         .style("z-index", 1)
    //         // .transition(circleIn)
    //         .transition()
    //         .duration(100)
    //         .style("background-color", "#2a4e6c")
    //         .style("height", "70px")
    //         .style("right", "15px")
    //         .styleTween("box-shadow", function() {
    //             var i = d3.interpolate("0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)", "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)");
    //             return function(t) {
    //                 return i(t);
    //             }
    //         })
    //         .style("width", function(d) { return (x(d.price) + 30) + "px";});

    //   }
    // });

    // document.getElementsByClassName("chart")[0].addEventListener("mouseout", (e) => {
    //   if (e.target && e.target.className === "bar"){
    //       d3.select(e.target)
    //         .style("z-index", 2)
    //         // .transition(circleOut)
    //         .transition()
    //         .duration(100)
    //         .style("background-color", "steelblue")
    //         .styleTween("box-shadow", function() {
    //             var i = d3.interpolate("0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.19)");
    //             return function(t) {
    //                 return i(t);
    //             }
    //         })
    //         .style("width", function(d) { return x(d.price) + "px";})
    //         .style("height", "40px")
    //         .style("right", "0px")
    //   }
    // });

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
        .style("z-index", "2")
        .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
        .attr("width", function(d, i) { return x(d.price) + "px"})
        .attr("id", function(d, i) {return i})
        .attr("height", barHeight + "px");

    const d3ExpOut = d3.transition()
      .duration(200)
      .ease(d3.easeExpOut);

    d3.select(el)
      .selectAll("rect")
      .on("mouseover", function () {
        d3.select(this)
          .transition()
          .style("fill", "red")
          .style("height", "20px");
      })
      .on("mouseout", function() {
        try {
          d3.select(this)
            .transition()
            .style("fill", "steelblue")
            .style("height", "10px");
        } catch (e) {
          error: e;
        }
      })

    // document.getElementsByClassName("chartSvg")[0].addEventListener("mouseover", (e) => {
    //   if (e.target && e.target.nodeName === "rect") {
    //     d3.select(e.target)
    //       .transition()
    //       .style("fill", "#2a4e6c")
    //       .style("height", "20px")
    //       .style("z-index", "-1")
    //   }
    // });

    // document.getElementsByClassName("chartSvg")[0].addEventListener("mouseout", (e) => {
    //   if (e.target && e.target.nodeName === "rect") {
    //     d3.select(e.target)
    //       .transition()
    //       .duration(1000)
    //       .style("fill", "steelblue")
    //       .style("height", "10px")
    //       .style("z-index", "2");
    //   }
    // });

    const now2 = Date.now();

    console.log(`svg: ${now2 - now1}`);
  }

  componentDidMount() {
    this.drawD3Bar(".chart", this.props, this.state);
    // this.drawD3BarSvg(".chartSvg", this.props, this.state);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return this.props.listings != nextProps.listings;
  // }

  componentDidUpdate() {
    this.drawD3Bar(".chart", this.props, this.state);
    // this.drawD3BarSvg(".chartSvg", this.props, this.state);
  }

  render() {
    return (
      <div>
        <div>
          <p>Hi!</p>
          <div id='chart_div'></div>
        </div>

        <div style={{margin: "50px"}} ref="d3PriceBar" className="chart"></div>
        <p>Hiya!</p>
        <div>
          <svg className="chartSvg">{this.props.children}</svg>
        </div>
      </div>
    );
  }
}