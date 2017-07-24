import React, { Component } from 'react';
import { BarChart } from 'react-d3-basic';
import './App.css';

const NUM_OF_ATTEMPTS = 6;
const FREETHROW_PERCENTAGE = 70; // %

export default class App extends Component {

  change_ft_percent = (event) => {
    const input_pct = event.target.value;
    if (input_pct >= 0 && input_pct <= 100) {
      this.setState({ ft_value: input_pct });
    }
  }
  change_num_of_attempts = (event) => {
    const input_num = event.target.value;

    if (input_num > 0 && input_num <= 50) {
      this.setState({ num_of_attempts: input_num });
    }
  }

  // Lifecycle Methods
  constructor(props){
    super(props);

    this.state = {
      ft_value: FREETHROW_PERCENTAGE,
      num_of_attempts: NUM_OF_ATTEMPTS,
    }

    this.change_ft_percent = this.change_ft_percent.bind(this);
    this.change_num_of_attempts = this.change_num_of_attempts.bind(this)
  }
  render() {
    const {
      ft_value,
      num_of_attempts
    } = this.state;

    return (
      <div className="App">
        <h1>Freethrow Probability Distribution Grapher</h1>
        <Input 
          ft_value={ft_value}
          num_of_attempts={num_of_attempts}
          change_ft_percent={this.change_ft_percent}
          change_num_of_attempts={this.change_num_of_attempts}
        />
        <Chart 
          n={num_of_attempts}
          ft_value={ft_value}
          num_of_attempts={num_of_attempts}
        />
      </div>
    );
  }
}

const Input = ({
  ft_value,
  num_of_attempts,
  change_ft_percent,
  change_num_of_attempts,
}) =>
  <form className="input-wrapper">
    <div>
      <label>Freethrow %</label>
      <input 
        type="number" 
        name="freethrow_percent" 
        value={ft_value}
        onChange={change_ft_percent}
      />
    </div>
    <div>
      <label># of Attempts</label>
      <input 
        type="number" 
        name="number_of_attempts" 
        value={num_of_attempts}
        onChange={change_num_of_attempts}
      />
    </div>
  </form>

class Chart extends Component {
  factorial(n){
    if (n<2){
      return 1
    }
    return n*this.factorial(n-1);
  }

  n_choose_x(x, n){
    return this.factorial(n) / (
      this.factorial(x) * this.factorial(n-x)
    );
  }

  probability_of_x_in_n(x, n, ft_value, num_of_attempts){
    const combination = this.n_choose_x(x,n);
    const probability_of_basket = ft_value**x;
    const probability_of_non_basket = (1-ft_value)**(n-x);

    console.log(ft_value);
    console.log(combination);
    console.log(probability_of_basket);
    console.log(probability_of_non_basket);
    return combination * probability_of_basket * probability_of_non_basket;
  }

  // Lifecycle Methods
  constructor(props){
    super(props);

    this.probability_of_x_in_n = this.probability_of_x_in_n.bind(this);
    this.n_choose_x = this.n_choose_x.bind(this);
    this.factorial = this.factorial.bind(this);
  }

  render() {
    const {
      n,
      ft_value,
      num_of_attempts,
    } = this.props;

    const chartData = []
    for (let x=0; x<=n; x++) {
      chartData.push({
        baskets_scored: x,
        probability: round_to_x(
          this.probability_of_x_in_n(
            x, n, ft_value/100, num_of_attempts
          ), 
          4
        )
      });
    }
    console.log(chartData);
    
    const width = 700;
    const height = 300;
    const margins = {
      left: 100,
      right: 100,
      top: 50,
      bottom: 50
    };
    const title = "Frequency Distribution";
    const chartSeries = [
      {
        field: 'probability',
        name: 'Probability',
      }
    ];
    const x = (d) => {
      return d.baskets_scored;
    };
    const xScale = 'ordinal';
    const xLabel = 'Baskets Scored';
    const yLabel = 'Probability';
    const yTicks = [10, '%'];

    return (
      <BarChart 
        title={title}
        margins={margins}
        data={chartData}
        width={width}
        height={height}
        chartSeries={chartSeries}
        x={x}
        xScale={xScale}
        xLabel={xLabel}
        yLabel={yLabel}
        yTicks={yTicks}
      />
    );
  }
}

const round_to_x = (num, x=3) => {
  const factor = 10**(x);
  return Math.round(num * factor) / factor;
}
