import React from 'react';
//import { Link } from 'react-router-dom';

/* class Welcome1 extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}</h1>;
    }
}

function Welcome2(props) {
    return <h1>Hello, {props.name}</h1>;
}

class Test extends React.Component {
    render() {
        return (
            <>
                <Welcome1 name="PEDRO" />
                <Welcome2 name="MARIA" />
            </>
        );
    }
}
 */

/////////////////////////////////////////

/* function Test() {
    function handleClick(e) {
      e.preventDefault();
      console.log('The link was clicked.');
    }
  
    return (
      <a href="#" onClick={handleClick}>
        Click me
      </a>
    );
} */

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isToggleOn: true};

        // Este enlace es necesario para hacer que `this` funcione en el callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
        isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        return (
        <button onClick={this.handleClick}>
            {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
        );
    }
}

////////////////////////////////////////

/* class Test extends React.Component {
    constructor(props) {
      super(props);
      this.state = { seconds: 0 };
    }
  
    tick() {
      this.setState(state => ({
        seconds: state.seconds + 1
      }));
    }
  
    componentDidMount() {
      this.interval = setInterval(() => this.tick(), 1000);
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    render() {
      return (
        <div>
          Segundos: {this.state.seconds}
        </div>
      );
    }
  }
 */


export default Test;