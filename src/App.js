import React, {Component} from 'react';
import CanvasJSReact from './canvasjs/canvasjs.react';
import './App.css';

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let dataPointsS = [];
let dataPointsI = [];
let dataPointsR = [];

class App extends Component {

  render() {
    const options = {
      theme: "light2",
      title: {
        text: "SIR model"
      },
      axisY: {
        title: "Fraction of population",
        prefix: "",
        includeZero: true
      },
      data: [
        {
          type: "line",
          name: "S",
          showInLegend: true,
          xValueFormatString: "day #0",
          yValueFormatString: "#,####0.0000",
          dataPoints: dataPointsS
        },
        {
          type: "line",
          name: "I",
          showInLegend: true,
          xValueFormatString: "day #0",
          yValueFormatString: "#,####0.0000",
          dataPoints: dataPointsI
        },
        {
          type: "line",
          name: "R",
          showInLegend: true,
          xValueFormatString: "day #0",
          yValueFormatString: "#,####0.0000",
          dataPoints: dataPointsR
        },

      ]
    }
    return (
        <div>
          <CanvasJSChart options = {options}
                         onRef={ref => this.chart = ref}
          />
          {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
  }

  componentDidMount(){
    let chart = this.chart;

    fetch('http://127.0.0.1:5000/get_sir_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {
            username: 'john',
            password: 'hello',
            total_population: 5000000,
            I_0: 1000,
            R_0: 0,
            average_number_of_people_infected_per_day_per_person: 0.2,
            average_days_sick_per_person: 7,
            duration_days: 365,
            timestep_days: 1
          })
    }).then(function(response) {
      return response.json();
    })
        .then(function(data) {
          for (let i = 0; i < data.length; i++) {
            dataPointsS.push({
              x: data[i]['t'],
              y: data[i]['S'],
            });
            dataPointsI.push({
              x: data[i]['t'],
              y: data[i]['I'],
            });
            dataPointsR.push({
              x: data[i]['t'],
              y: data[i]['R'],
            });
          }
          chart.render();
        });
  }
}

export default App;
