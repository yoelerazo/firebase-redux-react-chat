import React from 'react';
import { Link } from 'react-router-dom';

class LandingPage extends React.Component {
    render() {
        return (
            <div className="container h-100 d-flex flex-column justify-content-center">
                <div className="row justify-content-center">
                    <Link to="/home">
                        <h1>Welcome to Chat</h1>
                    </Link>
                </div>
                <div className="row">
                    <div className="col-sm text-center">
                        <Link to="/login">
                            <h5>Login</h5>
                        </Link>
                    </div>
                    <div className="col-sm text-center">
                        <Link to="/signup">
                            <h5>Signup</h5>
                        </Link>
                    </div>
                    <div className="col-sm text-center">
                        <Link to="/test">
                            <h6>Test</h6>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default LandingPage;