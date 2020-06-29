import React from 'react';
import Signup from '../componets/forms/Signup';
import Login from '../componets/forms/Login';
import { Link } from 'react-router-dom';

class LandingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true
        };

        this.handleClickButton =  this.handleClickButton.bind(this);
    }

    handleClickButton() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    render() {
        const { isToggleOn } = this.state;
        return (
            <div className="container h-100 d-flex flex-column justify-content-center">
                <div className="row flex-column justify-content-center mb-4">
                    <h3 className="text-center"> <Link to="/home" className="link">Welcome to Chat</Link> </h3>
                </div>
                <div className="row justify-content-center">
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header border-0 bg-white">
                                <div className="row">
                                    <div className="col">
                                        <button onClick={this.handleClickButton} className={`border-0 w-100 px-1 py-3 ${isToggleOn ? "bg-white" : "bg-light"}`}>
                                            Loging
                                        </button>
                                    </div>
                                    <div className="col">    
                                        <button onClick={this.handleClickButton} className={`border-0 w-100 px-1 py-3 ${isToggleOn ? "bg-light" : "bg-white"}`}>
                                            Signup
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body p-2">
                                { isToggleOn ? <Login /> : <Signup />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;