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
      axisX: {
        title: "Days"
      },
      data: [
          {
              type: "line",
              name: "S",
              showInLegend: true,
              xValueFormatString: "day #0",
              yValueFormatString: "S #,####0.0000",
              dataPoints: dataPointsS_sir
          },
          {
              type: "line",
              name: "I",
              showInLegend: true,
              xValueFormatString: "day #0",
              yValueFormatString: "I #,####0.0000",
              dataPoints: dataPointsI_sir
          },
          {
              type: "line",
              name: "R",
              showInLegend: true,
              xValueFormatString: "day #0",
              yValueFormatString: "R #,####0.0000",
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
          axisX: {
              title: "Days"
          },
          data: [
              {
                  type: "line",
                  name: "S",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "S #,####0.0000",
                  dataPoints: dataPointsS_seir
              },
              {
                  type: "line",
                  name: "E",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "E #,####0.0000",
                  dataPoints: dataPointsE_seir
              },
              {
                  type: "line",
                  name: "I",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "I #,####0.0000",
                  dataPoints: dataPointsI_seir
              },
              {
                  type: "line",
                  name: "R",
                  showInLegend: true,
                  xValueFormatString: "day #0",
                  yValueFormatString: "R #,####0.0000",
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
            <h4>S, E, I, R are short for Susceptible (people who can get sick), Exposed (to the virus), Infected (by the virus, shit hit the fan after exposure), Recovered (included severe cases of deadness).</h4>
        </div>

    );
  }

  componentDidMount(){
    let chart_sir = this.chart_sir;
    let chart_seir = this.chart_seir;


    let my_token = '';

    let header = new Headers();
    header.append('Content-Type', 'application/json');


    let sir_endpoint = 'https://studentprojectcorona.herokuapp.com/model/SIR';
    let seir_endpoint = 'https://studentprojectcorona.herokuapp.com/model/SEIR';

      fetch('https://studentprojectcorona.herokuapp.com/users', {
          method: 'GET'
      }).then(function (response) {
          return response.json();
      }).then(function (data) {
          if (data['users'].length === 0 || data['users'][0]['user'] !== 'john') {
              console.log("no johnny. do a refresh..")
              fetch('https://studentprojectcorona.herokuapp.com/register', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(
                      {
                          "username": "john",
                          "password": "hello"
                      }
                  )
              }).then(function (response) {
                  return response.json();
              }).then(function (data) {
                  console.log(data)
              });
          } else {
              console.log("heeeere`s johnny")
              fetch('https://studentprojectcorona.herokuapp.com/auth', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify(
                      {
                          "username": "john",
                          "password": "hello"
                      }
                  )
              }).then(function (response) {
                  return response.json();
              }).then(function (data) {
                  my_token = data['access_token']
                  header.append('Authorization', `JWT ${my_token}`);
                  fetch(sir_endpoint, {
                      method: 'POST',
                      headers: header,
                      body: JSON.stringify(
                          {
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
                          for (let i = 0; i < data['model'].length; i++) {
                              dataPointsS_sir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['S'],
                              });
                              dataPointsI_sir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['I'],
                              });
                              dataPointsR_sir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['R'],
                              });
                          }
                          chart_sir.render();
                      });

                  fetch(seir_endpoint, {
                      method: 'POST',
                      headers: header,
                      body: JSON.stringify(
                          {
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
                          for (let i = 0; i < data['model'].length; i++) {
                              dataPointsS_seir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['S'],
                              });
                              dataPointsE_seir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['E'],
                              });
                              dataPointsI_seir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['I'],
                              });
                              dataPointsR_seir.push({
                                  x: data['model'][i]['t'],
                                  y: data['model'][i]['R'],
                              });
                          }
                          chart_seir.render();
                      });
              });
          }
      });




  }
}

export default App;
