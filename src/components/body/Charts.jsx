//<editor-fold import
// how much a particular option adds or subtracts from rent

import React                                from 'react'
import chartcss from './chartcss'
import InlineSVG from 'svg-inline-react'

export default class Charts extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      data: '',
      avgRent: null,
      avgRentBR: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,        
      },
      data: {
        bedrooms: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
        postDate: {},
        priceByLocation: {},
        price: {},
        housing: {
          apartment: 0,
          condo: 0,
          house: 0,
          townhouse: 0,
          duplex: 0,
          land: 0,
          'in-law': 0,
          'cottage/cabin': 0
        },
        laundry: {
          'laundry on site': 0,
          'w/d in unit': 0,
          'laundry in bldg': 0
        },
        parking: {
          'off-street parking': 0,
          'detached garage': 0,
          'attached garage': 0,
          'valet parking': 0,
          'street parking': 0,
          'carport': 0,
          'no parking': 0
        },
        bath: {
          'private bath': 0,
          'no private bath': 0
        },
        private_room: {
          'private room': 0,
          'room not private': 0
        },
        cat: {
          'cats are OK - purrr': 0,
        },
        dog: {
          'dogs are OK - wooof': 0,
        },
        furnished: {
          'furnished': 0,
        },
        smoking: {
          'no smoking': 0,
        },
        'wheelchair': {
          'wheelchair accessible': 0,
        },
        sub_or_apt: {
          'sub': 0,
          'apt': 0,
        }

      }
    }
  }

//https://google-developers.appspot.com/chart/interactive/docs/gallery/areachart
//https://google-developers.appspot.com/chart/interactive/docs/gallery/barchart
//https://google-developers.appspot.com/chart/interactive/docs/gallery/calendar

// Show
// Average rent
// Average rent per bedrooms
// Scatter of rent per bedroom
// Scatter of rent per bedroom with other optiosn, like regions
// Number of listings
// Number of new listings since last login
// Plot on map
// Number of listings in filtered set
// icons for filtering
// Sliders for filtering

  componentDidMount() {
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Topping');
      data.addColumn('number', 'Slices');
      data.addRows([
        ['Mushrooms', 3],
        ['Onions', 1],
        ['Olives', 1],
        ['Zucchini', 1],
        ['Pepperoni', 2]
      ]);

      var options = {
        title:'How Much Pizza I Ate Last Night',
        width:400,
        height:300
      };

      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

    let d3Bars = d3.select('#d3_bar_graph')
      .selectAll('div')
      .data(this.props.listings)
      .enter().append("div")
        .style("background-color", "steelblue")
        .style("height", "1px")
        .style("width", (datum) => {
          if (datum.price !== null) {
            return datum.price / 10 + "px";
          } else {
            return "0px";
          }
        });

    this.setState({d3Bars: d3Bars})
  }

  render() {
    return (
      <div style={{height: '800px'}}>
        <p>Hi!</p>
        <div id='chart_div'></div>

        <div id='d3_bar_graph' style={{padding: '3px', margin: '10px', color: 'white'}}></div>

        <svg id='d3_bar_chart'></svg>
      </div>
    );
  }
}