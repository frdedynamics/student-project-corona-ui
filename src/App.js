import React, {Component} from 'react';
import CanvasJSReact from './canvasjs/canvasjs.react';
import './App.css';

let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let dataPointsS_sir = [];
let dataPointsI_sir = [];
let dataPointsR_sir = [];
let dataPointsS_seir = [];
let dataPointsE_seir = [];
let dataPointsI_seir = [];
let dataPointsR_seir = [];

class App extends Component {

  render() {
    const options_sir = {
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
              dataPoints: dataPointsS_sir
          },
          {
              type: "line",
              name: "I",
              showInLegend: true,
              xValueFormatString: "day #0",
              yValueFormatString: "#,####0.0000",
              dataPoints: dataPointsI_sir
          },
          {
              type: "line",
              name: "R",
              showInLegend: true,
              xValueFormatString: "day #0",
              yValueFormatString: "#,####0.0000",
              dataPoints: dataPointsR_sir
          },

      ]
    }

      const options_seir = {
          theme: "light2",
          title: {
              text: "SEIR model"
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
                  dataPoints: dataPointsS_seir
              },
              {
                  type: "line",
                  name: "E",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "#,####0.0000",
                  dataPoints: dataPointsE_seir
              },
              {
                  type: "line",
                  name: "I",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "#,####0.0000",
                  dataPoints: dataPointsI_seir
              },
              {
                  type: "line",
                  name: "R",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "#,####0.0000",
                  dataPoints: dataPointsR_seir
              },

          ]
      }

    return (
        <div>
          <CanvasJSChart options = {options_sir}
                         onRef={ref => this.chart_sir = ref}
          />
          {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
          <CanvasJSChart options = {options_seir}
                         onRef={ref => this.chart_seir = ref}
          />
          {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
  }

  componentDidMount(){
    let chart_sir = this.chart_sir;
    let chart_seir = this.chart_seir;

    fetch('http://127.0.0.1:5000/get_corona_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {
            model_type: 'SIR',
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
            dataPointsS_sir.push({
              x: data[i]['t'],
              y: data[i]['S'],
            });
            dataPointsI_sir.push({
              x: data[i]['t'],
              y: data[i]['I'],
            });
            dataPointsR_sir.push({
              x: data[i]['t'],
              y: data[i]['R'],
            });
          }
            chart_sir.render();
        });

    fetch('http://127.0.0.1:5000/get_corona_data', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(
          {
              model_type: 'SEIR',
              username: 'john',
              password: 'hello',
              total_population: 5000000,
              duration_days: 365,
              timestep_days: 1,
              alpha: 0.2,
              beta: 1.75,
              gamma: 0.5,
              rho: 0.7,
              social_distancing: false
          })
    }).then(function(response) {
      return response.json();
    })
      .then(function(data) {
          for (let i = 0; i < data.length; i++) {
              dataPointsS_seir.push({
                  x: data[i]['t'],
                  y: data[i]['S'],
              });
              dataPointsE_seir.push({
                  x: data[i]['t'],
                  y: data[i]['E'],
              });
              dataPointsI_seir.push({
                  x: data[i]['t'],
                  y: data[i]['I'],
              });
              dataPointsR_seir.push({
                  x: data[i]['t'],
                  y: data[i]['R'],
              });
          }
          chart_seir.render();
      });
  }
}

export default App;
